require_relative '../../../services/user_service.rb'

class Api::V1::WebhooksController < ApplicationController
    def create

        user = User.find_by(id: params[:payload][:tenant][:code].to_i)

        set_features_for_user(user.id, params[:payload][:change][:features])

        puts "------------------webhook------------------"
        puts params[:payload][:change][:features]

        render json: { status: :ok }
    end

    # THIS WORKS. But is delayed for some reason idk
    def set_features_for_user(user_id, features)
        user = User.find_by(id: user_id)
        features.each do |feature|
            if feature["name"] == "List Count"
                user.lists_allowed = feature["value"].to_i
            elsif feature["name"] == "Card Count"
                user.cards_allowed = feature["value"].to_i
                puts "updated card count to #{feature["value"]}"
            end
        end
        puts "finsihsed setting features WOWOWJW"
        user.save
    end
end