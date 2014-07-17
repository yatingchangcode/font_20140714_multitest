class ChatsController < WebsocketRails::BaseController

  def new_message
    broadcast_message :new_message, { :text => message[:text]}
  end

  def down_location
    broadcast_message :down_location, { :x => message[:x],:y => message[:y]}
  end

  def move_location
    broadcast_message :move_location, { :x => message[:x],:y => message[:y]}
  end

  def up_location
    broadcast_message :up_location, {}
  end

  def clear
    broadcast_message :clear, {}
    p 'clear'
  end

  def client_connected
    p "user connected #{Time.now}"
  end

  def client_disconnected
    p "user disconnected #{Time.now}"
  end
end
