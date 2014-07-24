class WritesController < WebsocketRails::BaseController

  def initialize_session
    # perform application setup here
    controller_store[:write_count] = 0
    p 'init'
  end

  def get_write_count
    # perform application setup here
    controller_store[:write_count] += 1

    data = {:write_count => controller_store[:write_count]}
    broadcast_message :get_write_count, data
  end

  def down_location
    broadcast_message :down_location, {:user_id => message[:user_id], :x => message[:x], :y => message[:y]}
  end

  def move_location
    broadcast_message :move_location, {:user_id => message[:user_id], :x => message[:x], :y => message[:y]}
  end

  def up_location
    broadcast_message :up_location, {}
  end

  def clear
    p message[:user_id]
    broadcast_message :clear, {:user_id => message[:user_id]}
  end

end
