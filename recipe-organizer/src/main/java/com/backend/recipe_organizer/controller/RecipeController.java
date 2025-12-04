package com.backend.recipe_organizer.controller;
import com.backend.recipe_organizer.model.Recipe;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.backend.recipe_organizer.repository.RecipeRepo;
import java.util.*;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {

@Autowired
private RecipeRepo recipeRepo;

@PostMapping
public Recipe addRecipe(@RequestBody Recipe recipe) {
    return recipeRepo.save(recipe);
} 

@GetMapping
public List<Recipe> getAllRecipes()
{
    return recipeRepo.findAll();
}

@PutMapping("/{id}")
public Recipe updateRecipe(@PathVariable String id,@RequestBody Recipe recipe)
{
    Optional<Recipe> existing=recipeRepo.findById(id);
    if(existing.isPresent())
    {
    Recipe updated=existing.get();
    updated.setTitle(recipe.getTitle());
    updated.setIngredients(recipe.getIngredients());
    updated.setInstructions(recipe.getInstructions());
    return recipeRepo.save(updated);
    }
    else
    return null;
}

@DeleteMapping("/{id}")
public void deleteRecipe(@PathVariable String id)
{
    recipeRepo.deleteById(id);
}

}
