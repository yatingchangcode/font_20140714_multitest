class WritesController < WebsocketRails::BaseController

  def initialize_session
    # perform application setup here
    controller_store[:write_count] = 0
    controller_store[:user_id_file_path] = {}
    controller_store[:game_id] = 0
    controller_store[:stage_name] = ""
    controller_store[:visitors] = []
  end

  def get_write_count
    # perform application setup here
    data = {:write_count => controller_store[:write_count]}
    broadcast_message :get_write_count, data
  end

  def set_gameinfo_to_socket
    controller_store[:game_id] = message[:game]
    controller_store[:stage_name] = message[:stage]
    controller_store[:visitors] = message[:visitors].split(",")
    # p controller_store[:game_id]
    # p controller_store[:stage_name]
    # p controller_store[:visitors]
  end

  def down_location
    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id], :x => message[:x], :y => message[:y], :stamp => message[:stamp]}
    manager_connection.send_message :down_location, data
    cache_action(message[:user_id], "down", message[:x], message[:y], message[:stamp])
  end

  def move_location
    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id], :x => message[:x], :y => message[:y], :stamp => message[:stamp], :server_receive_time => Time.now.to_i*1000 }
    manager_connection.send_message :move_location, data
    cache_action(message[:user_id], "move", message[:x], message[:y], message[:stamp])
  end

  def up_location
    manager_connection = WebsocketRails.users[0]
    data = {}
    manager_connection.send_message :up_location, data
  end

  def clear
    #p message[:user_id]
    cid = message[:user_id]
    broadcast_message :clear, {:user_id => cid, :stamp => message[:stamp]}
    if cid
      if controller_store[:user_id_file_path] && controller_store[:user_id_file_path][cid]
        cache_action(cid, "clear", nil, nil, message[:stamp])
      else
        renew_one(cid, true)
      end
    end
  end

  def clearAll
    broadcast_message :clear, {}
    renew_all(controller_store[:visitors], true)
  end

  def reset
      broadcast_message :reset, {:second => message[:second], :stage => message[:stage]}
  end
  
  def continue_write
      trigger_id = message[:user_id]
      has_track = message[:has_track]
      if trigger_id and controller_store[:user_id_file_path][trigger_id] == nil
        manager_connection = WebsocketRails.users[0]
        trigger_connection  = WebsocketRails.users[trigger_id.to_i]
        data = message
        if has_track
          renew_one(trigger_id, false)
        end
        manager_connection.send_message :continue_write, data
        trigger_connection.send_message :continue_write, data
      end
  end

  def submit
    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id], :stamp => message[:stamp]}
    manager_connection.send_message :submit, data
  end

  def cancelSubmit
    manager_connection = WebsocketRails.users[0]
    data = message
    manager_connection.send_message :cancelSubmit, data
  end
  
  def action
    trigger_id = message[:user_id]
    manager_connection = WebsocketRails.users[0]
    trigger_connection = WebsocketRails.users[trigger_id.to_i]
    # Just for passing other properties 
    data = message
    p message[:action]
    if message[:action] == "device_start"
      #save
      start_cache(trigger_id, trigger_id, controller_store[:game_id], controller_store[:stage_name])
      cache_action(trigger_id, "create", nil, nil, message[:stamp])
    elsif message[:action] == "device_stop"
      cache_action(trigger_id, "end", nil, nil, message[:stamp])
      save_action(trigger_id)
    end
    #data = {:action => message[:action], :user_id => trigger_id.to_s, :stamp => message[:stamp]}
    manager_connection.send_message :action, data
    trigger_connection.send_message :action, data
  end

  def setCorrectCount
    manager_connection = WebsocketRails.users[0]
    data = message
    manager_connection.send_message :setCorrectCount, data
  end

  def showCorrectUsers
    manager_connection = WebsocketRails.users[0]
    data = message
    manager_connection.send_message :showCorrectUsers, data
  end

  def userOut
    manager_connection = WebsocketRails.users[0]
    data = message
    manager_connection.send_message :userOut, data
  end

  def right
    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id]}
    manager_connection.send_message :right, data
  end

  def removeO
    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id]}
    manager_connection.send_message :removeO, data
  end


  private
  def renew_one(cid, renew)
    if controller_store[:user_id_file_path]
      controller_store[:user_id_file_path]["#{cid}-renew"] = renew
    end
  end

  def renew_all(visitors, renew)
    visitors.each do |x|
      renew_one(x, renew)
      #controller_store[:user_id_file_path]["#{x}-renew"] = renew
    end
  end

  def start_cache(uid, cid, game_id, stage)
    @game = Game.find(game_id)
    @visitor = @game.visitors.find_by(number: uid)

    #p message[:create_at].to_i
    #client_create_time = Time.at(message[:create_at].to_i).strftime("%Y%m%d_%H%M%S")
    #file_name = "#{@visitor.name}_stage#{message[:stage]}_#{client_create_time}"
    file_name = "#{@visitor.name}_stage#{stage}_#{Time.now.strftime("%Y%m%d_%H%M%S_%L")}"

    record_path ||= File.expand_path(File.join("record"), Rails.public_path)
    file_path = "#{record_path}/game#{game_id}_#{@game.created_at.strftime("%Y%m%d")}/#{file_name}"
    
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

      if controller_store[:user_id_file_path]["#{cid}-renew"] == nil
        controller_store[:user_id_file_path]["#{cid}-renew"] = true
      end

      file_path = data[0]
      tosave = {}
      tosave[:file_path] = data[0]
      tosave[:renew] = controller_store[:user_id_file_path]["#{cid}-renew"]
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
