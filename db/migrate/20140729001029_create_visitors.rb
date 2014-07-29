class CreateVisitors < ActiveRecord::Migration
  def change
    create_table :visitors do |t|
      t.integer :game_id
      t.integer :number
      t.string :name
      t.string :image

      t.timestamps
    end
  end
end
