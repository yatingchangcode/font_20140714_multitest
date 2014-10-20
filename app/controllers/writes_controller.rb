class WritesController < WebsocketRails::BaseController

  def initialize_session
    # perform application setup here
    controller_store[:write_count] = 0
  end



  def get_write_count
    # perform application setup here
    data = {:write_count => controller_store[:write_count]}
    broadcast_message :get_write_count, data
  end

  def down_location
    manager_connection = WebsocketRails.users[0]
    record_connection = WebsocketRails.users["record"]
    data = {:user_id => message[:user_id], :x => message[:x], :y => message[:y], :stamp => message[:stamp]}
    manager_connection.send_message :down_location, data
    record_connection.send_message :down_location, data
  end

  def move_location
    manager_connection = WebsocketRails.users[0]
    record_connection = WebsocketRails.users["record"]
    data = {:user_id => message[:user_id], :x => message[:x], :y => message[:y], :stamp => message[:stamp]}
    manager_connection.send_message :move_location, data
    record_connection.send_message :move_location, data
  end

  def up_location
    manager_connection = WebsocketRails.users[0]
    record_connection = WebsocketRails.users["record"]
    data = {}
    manager_connection.send_message :up_location, data
    record_connection.send_message :up_location, data
  end

  def clear
    p message[:user_id]
    broadcast_message :clear, {:user_id => message[:user_id], :stamp => message[:stamp]}
  end

  def clearAll
      broadcast_message :clear, {}
  end

  def reset
      broadcast_message :reset, {:second => message[:second]}
  end
  
  def continue_write
      trigger_id = message[:user_id]
      manager_connection = WebsocketRails.users[0]
      trigger_connection  = WebsocketRails.users[trigger_id.to_i]
      data = message
      manager_connection.send_message :continue_write, data
      trigger_connection.send_message :continue_write, data
  end

  def submit
    manager_connection = WebsocketRails.users[0]
    record_connection = WebsocketRails.users["record"]
    data = {:user_id => message[:user_id], :stamp => message[:stamp]}
    manager_connection.send_message :submit, data
    record_connection.send_message :submit, data
  end
  
  def action
    trigger_id = message[:user_id]
    manager_connection = WebsocketRails.users[0]
    trigger_connection = WebsocketRails.users[trigger_id.to_i]
    record_connection = WebsocketRails.users["record"]
    # Just for passing other properties 
    data = message
    #data = {:action => message[:action], :user_id => trigger_id.to_s, :stamp => message[:stamp]}
    manager_connection.send_message :action, data
    trigger_connection.send_message :action, data
    record_connection.send_message :action, data
  end

  def right
    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id]}
    manager_connection.send_message :right, data
  end

  def wrong
    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id]}
    manager_connection.send_message :wrong, data
  end


end
