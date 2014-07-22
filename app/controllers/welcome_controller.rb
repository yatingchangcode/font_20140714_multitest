class WelcomeController < ApplicationController

  def write
    @user_id = params[:user_id]
  end

  def read
    @count = 20

    @range = 1..@count
  end

end
