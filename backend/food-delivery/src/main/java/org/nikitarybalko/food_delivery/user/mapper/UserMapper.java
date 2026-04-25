package org.nikitarybalko.food_delivery.user.mapper;

import org.mapstruct.Mapper;
import org.nikitarybalko.food_delivery.user.dto.UserResponse;
import org.nikitarybalko.food_delivery.user.model.User;

@Mapper
public interface UserMapper {

    UserResponse toResponse(User user);
}
