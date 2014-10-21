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

  # namespace :stage1and2 do
    subscribe :down_location, :to => WritesController, :with_method => :down_location
    subscribe :move_location, :to => WritesController, :with_method => :move_location
    subscribe :up_location, :to => WritesController, :with_method => :up_location
    subscribe :clear,    :to => WritesController, :with_method => :clear
    subscribe :submit,   :to => WritesController, :with_method => :submit
    subscribe :action,   :to => WritesController, :with_method => :action
    subscribe :right,    :to => WritesController, :with_method => :right
    subscribe :wrong,    :to => WritesController, :with_method => :wrong
    subscribe :clearAll, :to => WritesController, :with_method => :clearAll
    subscribe :reset,    :to => WritesController, :with_method => :reset  
    subscribe :continue_write, :to => WritesController, :with_method => :continue_write
    subscribe :setRightCount, :to => WritesController, :with_method => :setRightCount
    # read trigger start or stop, write bind receiveAlert
  # end

  namespace :idioms do
    subscribe :down_location, :to => WritesIdiomsController, :with_method => :down_location
    subscribe :move_location, :to => WritesIdiomsController, :with_method => :move_location
    subscribe :up_location, :to => WritesIdiomsController, :with_method => :up_location
    subscribe :clear, :to => WritesIdiomsController, :with_method => :clear
    subscribe :submit, :to => WritesIdiomsController, :with_method => :submit
    subscribe :move_block, :to => WritesIdiomsController, :with_method => :move_block
    subscribe :send_text, :to => WritesIdiomsController, :with_method => :send_text
    subscribe :end_round, :to => WritesIdiomsController, :with_method => :end_round
  end


  subscribe :client_connected, to: ChatsController, with_method: :client_connected
  subscribe :client_connected, :to => ChatsController, :with_method => :get_user_count

  subscribe :client_disconnected, to: ChatsController, with_method: :client_disconnected  
  subscribe :client_disconnected, :to => ChatsController, :with_method => :get_user_count
end
