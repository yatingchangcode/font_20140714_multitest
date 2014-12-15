class WritesB2Controller < WebsocketRails::BaseController

  def initialize_session
    # perform application setup here
    controller_store[:write_count] = 0

    controller_store[:user_id_write_block] = {}
    controller_store[:user_id_file_path] = {}
    controller_store[:game_id] = 0
    controller_store[:stage_name] = ""
    controller_store[:visitors] = []
  end

  def set_gameinfo_to_socket
    controller_store[:game_id] = message[:game]
    controller_store[:stage_name] = message[:stage]
    controller_store[:visitors] = message[:visitors].split(",")
    p controller_store[:game_id]
    p controller_store[:stage_name]
    p controller_store[:visitors]
  end

  def down_location
    data = {:user_id => message[:user_id],block: message[:block], :x => message[:x], :y => message[:y], :stamp => message[:stamp], cid: "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}" }
    p data[:cid]
    broadcast_message :down_location, data
    cache_action(data[:cid], "down", message[:x], message[:y], message[:stamp])
  end

  def move_location
    data = {:user_id => message[:user_id],block: message[:block], :x => message[:x], :y => message[:y], :stamp => message[:stamp], cid: "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}" }
    p data[:cid]
    broadcast_message :move_location, data
    cache_action(data[:cid], "move", message[:x], message[:y], message[:stamp])
  end

  def up_location
    data = {cid: "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}" }
    broadcast_message :up_location, data
  end

  def clear
    data = {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp], cid: "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}" }
    p data[:cid]
    broadcast_message :clear, data
    cache_action(data[:cid], "clear", nil, nil, message[:stamp])
  end

  def clearAll
    broadcast_message :clear, {}
    renew_all(controller_store[:visitors], true)
  end

  def submit
    data = {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp], cid: "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}" }
    broadcast_message :submit, data
  end

  def right
    data = {:user_id => message[:user_id], block: message[:block], :stamp => message[:stamp], cid: "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}" }
    broadcast_message :right, data
  end

  def remove_o
    data = {:user_id => message[:user_id], block: message[:block], :stamp => message[:stamp], cid: "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}" }
    broadcast_message :remove_o, data
  end

  def move_block
    data = {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp], cid: "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}" }
    broadcast_message :move_block, data
  end

  def setCorrectCount
    manager_connection = WebsocketRails.users[0]
    data = data = {:user_id => message[:user_id],block: message[:block], count: message[:count], :stamp => message[:stamp], cid: "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}" }
    manager_connection.send_message :setCorrectCount, data
  end

  def showCorrectUsers
    manager_connection = WebsocketRails.users[0]
    data = message
    manager_connection.send_message :showCorrectUsers, data
  end


  def end_round
    controller_store[:user_id_write_block][message[:user_id]] = message[:blocks]

    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id]}
    manager_connection.send_message :end_round, data
  end

  def rewrite
    data = {block: message[:block], :stamp => message[:stamp], ink: message[:ink]}
    broadcast_message :rewrite, data
  end

  def action
    trigger_id = message[:user_id]
    manager_connection = WebsocketRails.users[0]
    trigger_connection = WebsocketRails.users[trigger_id.to_i]
    # Just for passing other properties 
    data = message
    if message[:action] == "device_start"
      #save
      cid = "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}"
      p "start "+cid
      start_cache(trigger_id, cid, controller_store[:game_id], controller_store[:stage_name])
      cache_action(cid, "create", nil, nil, message[:stamp])
      #p controller_store[:user_id_file_path]
    elsif message[:action] == "device_stop"
      cid = "#{message[:user_id]}_#{message[:block][:row]}_#{message[:block][:column]}"
      p "stop "+cid
      cache_action(cid, "end", nil, nil, message[:stamp])
      save_action(cid)
    end
    #data = {:action => message[:action], :user_id => trigger_id.to_s, :stamp => message[:stamp]}
    manager_connection.send_message :action, data
    trigger_connection.send_message :action, data
  end

  private
  def transfer_column_row_to_block(hash)
    (hash[:row].to_i - 1)* 12 + hash[:column].to_i
  end

  def renew_one(cid, renew)
    controller_store[:user_id_file_path]["#{cid}-renew"] = renew
  end

  def renew_all(visitors, renew)
    visitors.each do |x|
      (1..3).to_a.each do |r|
        (1..3).to_a.each do |c|
          renew_one("#{x}_#{r}_#{c}", renew)
        end
      end
    end
  end

  def start_cache(uid, cid, game_id, stage)
    p "in start cache"
    # p game_id
    # p stage
    game = Game.find(game_id)
    visitor = game.visitors.find_by(number: uid)

    #p message[:create_at].to_i
    #client_create_time = Time.at(message[:create_at].to_i).strftime("%Y%m%d_%H%M%S")
    #file_name = "#{@visitor.name}_stage#{message[:stage]}_#{client_create_time}"
    file_name = "#{visitor.name}_stage#{stage}_#{Time.now.strftime("%Y%m%d_%H%M%S")}"

    record_path ||= File.expand_path(File.join("record"), Rails.public_path)

    #p "#{record_path}/game#{game_id}_#{game.created_at.strftime("%Y%m%d")}/#{file_name}"
    file_path = FileUtils.mkdir_p("#{record_path}/game#{game_id}_#{game.created_at.strftime("%Y%m%d")}/#{file_name}")
    
    if controller_store[:user_id_file_path].nil?
      controller_store[:user_id_file_path] = {}
    end
    controller_store[:user_id_file_path][cid] = file_path
  end

  def cache_action(cid, action, x, y, stamp)
    #p message[:user_id]+" save_file: cache frames"
    if controller_store[:user_id_file_path] && controller_store[:user_id_file_path][cid]
      controller_store[:user_id_file_path][cid] << [ action, x, y, stamp ]
    end
  end

  def save_action(cid)
    p "in save action"
    if controller_store[:user_id_file_path]
      data = controller_store[:user_id_file_path][cid]
      controller_store[:user_id_file_path][cid] = nil;

      file_path = data[0]
      tosave = {}
      tosave[:file_path] = data[0]
      tosave[:renew] = controller_store[:user_id_file_path]["#{cid}-renew"] || false
      tosave[:cid] = cid
      tosave[:data] = data[1..-1]
      #data = data[1..-1]
      #data.each do |x|
      #f = File.open("#{file_path}.json", 'a') {|f| f.write(x)}
      #end
      f = File.open("#{file_path}.json", 'a') {|f| f.write(JSON.dump tosave)}
      renew_one(cid, false)
    end
  end

end
