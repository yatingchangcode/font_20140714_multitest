class ChatsController < WebsocketRails::BaseController

  def new_message
    broadcast_message :new_message, { :text => message[:text]}
  end

  def controller_down_location
    broadcast_message :down_location, { :x => message[:x],:y => message[:y]}
  end

  def controller_move_location
    broadcast_message :move_location, { :x => message[:x],:y => message[:y]}
  end

  def controller_up_location
    broadcast_message :up_location, {}
  end

  def client_connected
    p "user connected #{Time.now}"
  end

  def client_disconnected
    p "user disconnected #{Time.now}"
  end
end
