Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :users do
        resources :lists do
          resources :cards
          patch '/cards/:card1_id/switch/:card2_id', to: 'cards#switch'
        end
        patch '/lists/:list1_id/switch/:list2_id', to: 'lists#switch'
      end
      post '/signin', to: 'users#signin'
      post '/signup', to: 'users#signup'
      resources :webhooks, only: :create
    end
  end
end

# add custom patch route to handle def switch for lists
# Rails.application.routes.draw do
#   namespace :api do
#     namespace :v1 do
#       resources :lists do
#         resources :cards
#       end
#       patch '/lists/switch/:list1_id/:list2_id', to: 'lists#switch'
#     end
#   end
# end

