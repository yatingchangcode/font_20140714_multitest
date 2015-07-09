class WelcomeController < ApplicationController

  def write
    @user_id = params[:user_id]
    @stage = "A1"
  end

  def write_idioms
    @user_id = params[:user_id]
    @stage = "B3"
  end

  def write_B2
    @user_id = params[:user_id]
    @stage = "B2"
  end

  def read
    @count = 20

    @range = 1..@count

    @user_unregs = [2,3]
  end

end
