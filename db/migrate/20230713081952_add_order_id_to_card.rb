class AddOrderIdToCard < ActiveRecord::Migration[7.0]
  def change
    add_column :cards, :orderId, :integer
  end
end
