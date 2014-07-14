class ChatsController < WebsocketRails::BaseController

  def new_message
    broadcast_message :new_message, { :text => message[:text]}
  end

  def client_connected
    p 'user connected'
  end

  def client_disconnected
    p 'user disconnected'
  end
end
