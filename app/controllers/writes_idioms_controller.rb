class WritesIdiomsController < WebsocketRails::BaseController

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
  end


  def down_location
    data = {:user_id => message[:user_id],block: message[:block], :x => message[:x], :y => message[:y], :stamp => message[:stamp], cid: "#{message[:block][:row]}_#{message[:block][:column]}"}
    broadcast_message :down_location, data
    cache_action(data[:cid], "down", message[:x], message[:y], message[:stamp])
  end

  def move_location
    data = {:user_id => message[:user_id],block: message[:block], :x => message[:x], :y => message[:y], :stamp => message[:stamp], cid: "#{message[:block][:row]}_#{message[:block][:column]}"}
    broadcast_message :move_location, data
    cache_action(data[:cid], "move", message[:x], message[:y], message[:stamp])
  end

  def up_location
    data = {}
    broadcast_message :up_location, data
  end

  def clear
    data = {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp], cid: "#{message[:block][:row]}_#{message[:block][:column]}"}
    broadcast_message :clear, data
    cid = data[:cid]
    if cid
      if controller_store[:user_id_file_path] && controller_store[:user_id_file_path][cid]
        cache_action(cid, "clear", nil, nil, message[:stamp])
      else
        renew_one(cid, true)
      end
    end
  end
  
  def submit
    data = {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp]}
    broadcast_message :submit, data
  end

  def move_block
    data = {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp]}
    broadcast_message :move_block, data
  end

  def send_text
    data = {block: message[:block], :stamp => message[:stamp], text: message[:text]}
    broadcast_message :send_text, data
  end

  def end_round
    controller_store[:user_id_write_block][message[:user_id]] = message[:blocks]

    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id]}
    manager_connection.send_message :end_round, data
  end

  def continue_write
      trigger_id = message[:user_id]
      manager_connection = WebsocketRails.users[0]
      trigger_connection  = WebsocketRails.users[trigger_id.to_i]
      data = message
      manager_connection.send_message :continue_write, data
      trigger_connection.send_message :continue_write, data
  end

  def rewrite
    data = {block: message[:block], :stamp => message[:stamp], ink: message[:ink]}
    broadcast_message :rewrite, data
  end

  def action
    trigger_id = message[:user_id]
    manager_connection = WebsocketRails.users[0]
    trigger_connection = WebsocketRails.users[trigger_id.to_i]
    #record_connection = WebsocketRails.users["record"]
    # Just for passing other properties 
    data = message
    p message[:action]
    if message[:action] == "device_start"
      #save
      eid = "#{message[:block][:row]}_#{message[:block][:column]}"
      start_cache(trigger_id, eid, controller_store[:game_id], controller_store[:stage_name])
      cache_action(eid, "create", nil, nil, message[:stamp])
    elsif message[:action] == "device_stop"
      eid = "#{message[:block][:row]}_#{message[:block][:column]}"
      cache_action(eid, "end", nil, nil, message[:stamp])
      save_action(eid)
    end
    #data = {:action => message[:action], :user_id => trigger_id.to_s, :stamp => message[:stamp]}
    manager_connection.send_message :action, data
    trigger_connection.send_message :action, data
    #record_connection.send_message :action, data
  end

  private 

  def transfer_column_row_to_block(hash)
    (hash[:row].to_i - 1)* 12 + hash[:column].to_i
  end
  
  def renew_one(cid, renew)
    if controller_store[:user_id_file_path]
      controller_store[:user_id_file_path]["#{cid}-renew"] = renew
    end
  end

  def renew_all(visitors, renew)
    
    (1..8).to_a.each do |r|
      (1..12).to_a.each do |c|
        renew_one("#{r}_#{c}", renew)
      end
    end
    
  end

  def start_cache(uid, cid, game_id, stage)
    game = Game.find(game_id)
    visitor = game.visitors.find_by(number: uid)

    #p message[:create_at].to_i
    #client_create_time = Time.at(message[:create_at].to_i).strftime("%Y%m%d_%H%M%S")
    #file_name = "#{@visitor.name}_stage#{message[:stage]}_#{client_create_time}"
    file_name = "#{visitor.name}_stage#{stage}_#{Time.now.strftime("%Y%m%d_%H%M%S_%L")}"

    record_path ||= File.expand_path(File.join("record"), Rails.public_path)
    file_path = "#{record_path}/game#{game_id}_#{game.created_at.strftime("%Y%m%d")}/#{file_name}"
    
    if controller_store[:user_id_file_path]
      controller_store[:user_id_file_path][cid] = [file_path]
    end
  end

  def cache_action(cid, action, x, y, stamp)
    #p message[:user_id]+" save_file: cache frames"
    if controller_store[:user_id_file_path] && controller_store[:user_id_file_path][cid] 
      controller_store[:user_id_file_path][cid] << [ action, x, y, stamp ]
    end
  end

  def save_action(cid)
    if controller_store[:user_id_file_path] && controller_store[:user_id_file_path][cid] 
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
