class AddTitleColumnToVisitor < ActiveRecord::Migration
  def change
    add_column :visitors,:title,:string
  end
end
