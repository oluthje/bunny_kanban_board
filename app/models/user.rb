class User < ApplicationRecord
    validates :email, :email => {:strict_mode => true}
    has_many :lists, dependent: :destroy
end
