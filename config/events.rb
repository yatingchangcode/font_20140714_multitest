WebsocketRails::EventMap.describe do
  # You can use this file to map incoming events to controller actions.
  # One event can be mapped to any number of controller actions. The
  # actions will be executed in the order they were subscribed.
  #
  # Uncomment and edit the next line to handle the client connected event:
  #   subscribe :client_connected, :to => Controller, :with_method => :method_name
  #
  # Here is an example of mapping namespaced events:
  #   namespace :product do
  #     subscribe :new, :to => ProductController, :with_method => :new_product
  #   end
  # The above will handle an event triggered on the client like `product.new`.


  subscribe :open_file, :to => ChatsController, :with_method => :open_file
  subscribe :save_file, :to => ChatsController, :with_method => :save_file
  subscribe :close_file, :to => ChatsController, :with_method => :close_file
  subscribe :save_record, :to => ChatsController, :with_method => :save_record
  subscribe :is_connected, :to => ChatsController, :with_method => :is_connected

  # namespace :stage1and2 do
    subscribe :down_location, :to => WritesController, :with_method => :down_location
    subscribe :move_location, :to => WritesController, :with_method => :move_location
    subscribe :up_location, :to => WritesController, :with_method => :up_location
    subscribe :clear,    :to => WritesController, :with_method => :clear
    subscribe :submit,   :to => WritesController, :with_method => :submit
    subscribe :cancelSubmit,   :to => WritesController, :with_method => :cancelSubmit
    subscribe :set_gameinfo_to_socket, :to => WritesController, :with_method => :set_gameinfo_to_socket
    subscribe :action,   :to => WritesController, :with_method => :action
    subscribe :right,    :to => WritesController, :with_method => :right
    subscribe :removeO,    :to => WritesController, :with_method => :removeO
    subscribe :clearAll, :to => WritesController, :with_method => :clearAll
    subscribe :reset,    :to => WritesController, :with_method => :reset  
    subscribe :continue_write, :to => WritesController, :with_method => :continue_write
    subscribe :setCorrectCount, :to => WritesController, :with_method => :setCorrectCount
    subscribe :showCorrectUsers, :to => WritesController, :with_method => :showCorrectUsers
    subscribe :userOut,  :to => WritesController, :with_method => :userOut
    # read trigger start or stop, write bind receiveAlert
  # end

  namespace :idioms do
    subscribe :set_gameinfo_to_socket, :to => WritesIdiomsController, :with_method => :set_gameinfo_to_socket
    subscribe :down_location, :to => WritesIdiomsController, :with_method => :down_location
    subscribe :move_location, :to => WritesIdiomsController, :with_method => :move_location
    subscribe :up_location, :to => WritesIdiomsController, :with_method => :up_location
    subscribe :clear, :to => WritesIdiomsController, :with_method => :clear
    subscribe :submit, :to => WritesIdiomsController, :with_method => :submit
    subscribe :move_block, :to => WritesIdiomsController, :with_method => :move_block
    subscribe :send_text, :to => WritesIdiomsController, :with_method => :send_text
    subscribe :end_round, :to => WritesIdiomsController, :with_method => :end_round
    subscribe :rewrite, :to => WritesIdiomsController, :with_method => :rewrite
    subscribe :action,   :to => WritesIdiomsController, :with_method => :action
    subscribe :reset,   :to => WritesController, :with_method => :reset
  end

  namespace :B2 do
    subscribe :down_location, :to => WritesB2Controller, :with_method => :down_location
    subscribe :move_location, :to => WritesB2Controller, :with_method => :move_location
    subscribe :up_location, :to => WritesB2Controller, :with_method => :up_location
    subscribe :clear, :to => WritesB2Controller, :with_method => :clear
    subscribe :clearAll, :to => WritesController, :with_method => :clearAll
    subscribe :submit, :to => WritesB2Controller, :with_method => :submit
    subscribe :move_block, :to => WritesB2Controller, :with_method => :move_block
    subscribe :send_text, :to => WritesB2Controller, :with_method => :send_text
    subscribe :end_round, :to => WritesB2Controller, :with_method => :end_round
    subscribe :rewrite, :to => WritesB2Controller, :with_method => :rewrite
    subscribe :action,   :to => WritesController, :with_method => :action
    subscribe :reset,   :to => WritesController, :with_method => :reset
    subscribe :right,    :to => WritesB2Controller, :with_method => :right
    subscribe :remove_o,    :to => WritesB2Controller, :with_method => :remove_o
    subscribe :setCorrectCount, :to => WritesB2Controller, :with_method => :setCorrectCount
    subscribe :showCorrectUsers,    :to => WritesB2Controller, :with_method => :showCorrectUsers
  end


  subscribe :client_connected, to: ChatsController, with_method: :client_connected
  subscribe :client_connected, :to => ChatsController, :with_method => :get_user_count

  subscribe :client_disconnected, to: ChatsController, with_method: :client_disconnected  
  subscribe :client_disconnected, :to => ChatsController, :with_method => :get_user_count
end
