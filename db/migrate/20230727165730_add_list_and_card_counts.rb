class AddListAndCardCounts < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :cards_allowed, :integer, default: 0
    add_column :users, :lists_allowed, :integer, default: 0
  end
end
