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
    broadcast_message :down_location, {:user_id => message[:user_id], :x => message[:x], :y => message[:y], :stamp => message[:stamp]}
  end

  def move_location
    broadcast_message :move_location, {:user_id => message[:user_id], :x => message[:x], :y => message[:y], :stamp => message[:stamp]}
  end

  def up_location
    broadcast_message :up_location, {}
  end

  def clear
    p message[:user_id]
    broadcast_message :clear, {:user_id => message[:user_id], :stamp => message[:stamp]}
  end
  
  def submit
    broadcast_message :submit, {:user_id => message[:user_id], :stamp => message[:stamp]}
  end

  def action
    connection = WebsocketRails.users[0]
    data = {:action => message[:action], :user_id => message[:user_id].to_s, :stamp => message[:stamp]}
    connection.send_message :action, data
  end


end
