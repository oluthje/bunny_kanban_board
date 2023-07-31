class AddOrderIdToList < ActiveRecord::Migration[7.0]
  def change
    add_column :lists, :orderId, :integer
  end
end
