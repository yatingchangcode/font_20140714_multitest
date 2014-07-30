class WelcomeController < ApplicationController

  def write
    @user_id = params[:user_id]
  end

  def read
    @count = 20

    @range = 1..@count

    @user_unregs = [2,3]
  end

  def record
    @count = 20
  end

end
