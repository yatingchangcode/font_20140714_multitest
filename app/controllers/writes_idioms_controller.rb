class WritesIdiomsController < WebsocketRails::BaseController

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
    data = {:user_id => message[:user_id],block: message[:block], :x => message[:x], :y => message[:y], :stamp => message[:stamp]}
    manager_connection.send_message :down_location, data
    record_connection.send_message :down_location, data
  end

  def move_location
    manager_connection = WebsocketRails.users[0]
    record_connection = WebsocketRails.users["record"]
    data = {:user_id => message[:user_id],block: message[:block], :x => message[:x], :y => message[:y], :stamp => message[:stamp]}
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
    broadcast_message :clear, {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp]}
  end
  
  def submit
    manager_connection = WebsocketRails.users[0]
    record_connection = WebsocketRails.users["record"]
    data = {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp]}
    manager_connection.send_message :submit, data
    record_connection.send_message :submit, data
  end
  

end
