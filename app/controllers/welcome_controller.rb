class WelcomeController < ApplicationController

  def write
    @user_id = params[:user_id]
  end

  def write_idioms
    @user_id = params[:user_id]
  end

  def write_B2
    @user_id = params[:user_id]
  end

  def read
    @count = 20

    @range = 1..@count

    @user_unregs = [2,3]
  end

end
