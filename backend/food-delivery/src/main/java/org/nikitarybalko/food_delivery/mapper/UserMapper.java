package org.nikitarybalko.food_delivery.mapper;

import org.mapstruct.Mapper;
import org.nikitarybalko.food_delivery.dto.UserResponse;
import org.nikitarybalko.food_delivery.model.User;

@Mapper
public interface UserMapper {

    UserResponse toResponse(User user);
}
