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
  subscribe :down_location, :to => ChatsController, :with_method => :down_location
  subscribe :move_location, :to => ChatsController, :with_method => :move_location
  subscribe :up_location, :to => ChatsController, :with_method => :up_location
  subscribe :clear, :to => ChatsController, :with_method => :clear
  subscribe :new_message, :to => ChatsController, :with_method => :new_message

  subscribe :client_connected, to: ChatsController, with_method: :client_connected
  subscribe :client_disconnected, to: ChatsController, with_method: :client_disconnected  
end
