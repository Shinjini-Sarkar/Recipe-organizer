package com.backend.recipe_organizer.repository;
import com.backend.recipe_organizer.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
public interface UserRepo extends MongoRepository<User,String>{
   Optional<User> findByEmail(String email);
   boolean existsByEmail(String email); 
}
