class ChatsController < ApplicationController

  def incoming_message
    broadcast_message :new_message, {:user => current_user.screen_name, :text => message[:text]}
  end

  def client_connected
    p 'user connected'
    send_message :user_info, {:user => current_user.screen_name}
  end

  def client_disconnected
    p 'user disconnected'
  end
end
