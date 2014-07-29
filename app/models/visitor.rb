class Visitor < ActiveRecord::Base

  belongs_to :game

  mount_uploader :image, AvatarUploader

end
