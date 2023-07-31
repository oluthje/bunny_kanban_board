class UserService
    
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
        puts "finsihsed setting features"
        user.save
    end
end