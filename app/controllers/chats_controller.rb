class ChatsController < WebsocketRails::BaseController

  def initialize_session
    # perform application setup here
    controller_store[:user_count] = 0
    p 'init'
  end

  def get_user_count
    # perform application setup here
    data = {:user_count => controller_store[:user_count]}
    send_message :get_user_count, data
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



  def client_connected
    controller_store[:user_count] = controller_store[:user_count]+1
    p "user_count #{controller_store[:user_count]} ,user connected #{Time.now}"
    
  end

  def client_disconnected
    controller_store[:user_count] = controller_store[:user_count]-1
    p "user_count #{controller_store[:user_count]} ,user disconnected #{Time.now}"

  end
end
