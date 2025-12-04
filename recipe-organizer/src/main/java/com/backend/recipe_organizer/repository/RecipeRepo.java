package com.backend.recipe_organizer.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.backend.recipe_organizer.model.Recipe;
public interface RecipeRepo extends MongoRepository<Recipe,String>{
    //MongoRepository provides default CRUD methods
}
