class RenameUserBunnyPortalToken < ActiveRecord::Migration[7.0]
  def change
    rename_column :users, :bunny_portal_token, :bunny_portal_link
  end
end
