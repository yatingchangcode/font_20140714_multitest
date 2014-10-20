Rails.application.routes.draw do
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root 'games#index'

  arrayMap = (1..6).map { |x| %Q(get 'index#{x}'\n)}
  arrayMapReduce = arrayMap.reduce { |x,y| x+y }

  arrayMap = (1..6).map { |x| %Q(get 'tvwall#{x}'\n)}
  arrayMapReduce2 = arrayMap.reduce { |x,y| x+y }

  resources :welcome do
    collection do
      get 'index'
      get 'demo'
      get 'write'
      get 'write_idioms'
      get 'read'
      eval(arrayMapReduce)
      eval(arrayMapReduce2)
    end
  end 

  resources :games do
    resources :visitors
    member do
      get 'stage1'
      get 'stage2'
      get 'stage_idioms'
      get 'server1'
      get 'server2'
      get 'server_idioms'
      get 'record'
      get 'tvwall'
    end
    collection do
      get 'get_game_data'
    end
  end
  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
