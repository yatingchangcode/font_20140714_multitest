class WritesIdiomsController < WebsocketRails::BaseController

  def initialize_session
    # perform application setup here
    controller_store[:write_count] = 0

    controller_store[:user_id_write_block] = {}
  end



  def get_write_count
    # perform application setup here
    data = {:write_count => controller_store[:write_count]}
    broadcast_message :get_write_count, data
  end

  def down_location
    data = {:user_id => message[:user_id],block: message[:block], :x => message[:x], :y => message[:y], :stamp => message[:stamp]}
    broadcast_message :down_location, data
  end

  def move_location
    data = {:user_id => message[:user_id],block: message[:block], :x => message[:x], :y => message[:y], :stamp => message[:stamp]}
    broadcast_message :move_location, data
  end

  def up_location
    data = {}
    broadcast_message :up_location, data
  end

  def clear
    p message[:user_id]
    broadcast_message :clear, {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp]}
  end
  
  def submit
    data = {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp]}
    broadcast_message :submit, data
  end

  def move_block
    data = {:user_id => message[:user_id],block: message[:block], :stamp => message[:stamp]}
    broadcast_message :move_block, data
  end

  def end_round
    controller_store[:user_id_write_block][message[:user_id]] = message[:blocks]

    manager_connection = WebsocketRails.users[0]
    data = {:user_id => message[:user_id]}
    manager_connection.send_message :end_round, data
  end

  private 

  def transfer_column_row_to_block(hash)
    (hash[:row].to_i - 1)* 12 + hash[:column].to_i
  end
  

end
