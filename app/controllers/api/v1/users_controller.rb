# use the user_service.rb file to create a new user
# app/services/user_service.rb
# use require_relative to include the file user_service.rb
require_relative '../../../services/user_service.rb'

class Api::V1::UsersController < ApplicationController
    def signup
        some_user = User.find_by(email: params[:email])
        if some_user.present?
            render json: {error: "User already exists"}
        else
            @user = User.new(user_params)
            @user.save

            create_subscription(@user)
            features = get_features(@user)
            UserCreator.new.set_features_for_user(@user.id, features)
            set_portal_token(@user)

            render json: @user
        end
    end

    def signin
        @user = User.find_by(email: params[:email])
        if @user
            features = get_features(@user)
            UserCreator.new.set_features_for_user(@user.id, features)
            set_portal_token(@user)
            render json: @user
        else
            render json: {error: "User does not exist"}
        end
    end


    private
    def user_params
        params.require(:user).permit(:first_name, :last_name, :email)
    end
end

def create_subscription(user)
    full_name = user.first_name + " " + user.last_name

    response = BunnyApp::Subscription.create(
        # product_plan_code: 'kanban_board_small',
        price_list_code: "kanban_board_small_monthly",
        options: {
            account_name: full_name,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            trial: true,
            tenant_code: user.id.to_s,
            tenant_name: full_name,
        }
    )
end

def get_features(user)
    query = <<-'GRAPHQL'
    query tenant ($code: String!) {
        tenant (code: $code) {
        id    
        code    
        name    
        subdomain
        latestProvisioningChange {
            change
            createdAt
            features
            id
            updatedAt
        }    
        }
    }
    GRAPHQL

    variables = {
        "code": user.id.to_s
    }

    response = BunnyApp.query(query, variables)

    puts response

    features = response["data"]["tenant"]["latestProvisioningChange"]["change"]["features"]
    features
end

def set_portal_token(user)
    res = BunnyApp::PortalSession.create(
        tenant_code: user.id.to_s,
    )
    token = res["data"]["portalSessionCreate"]["token"]
    link = "#{BunnyApp.base_uri}/portal/subscriptions?token=#{token}"
    user.bunny_portal_link = link
end