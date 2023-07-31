class AddBunnyPortalTokenToUser < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :bunny_portal_token, :text, default: ""
  end
end
