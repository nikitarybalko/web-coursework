package org.nikitarybalko.food_delivery.mapper;

import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;
import org.nikitarybalko.food_delivery.dto.UserResponse;
import org.nikitarybalko.food_delivery.model.enums.Role;
import org.nikitarybalko.food_delivery.model.User;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class UserMapperTest {

    private final UserMapper mapper = Mappers.getMapper(UserMapper.class);

    @Test
    void toResponse_ShouldMapUser() {
        String email = "email@example.com";
        String name = "John Doe";
        String phone = "+123456789";
        User user = new User(email, "password123", name, phone, Role.CUSTOMER);
        UserResponse response = mapper.toResponse(user);

        assertNotNull(response);
        assertEquals(email, response.email());
        assertEquals(name, response.fullName());
        assertEquals(phone, response.phoneNumber());
    }
}
