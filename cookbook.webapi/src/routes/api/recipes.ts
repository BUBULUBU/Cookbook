// express
import express from 'express';

// controller
import {
    getAllRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getIngredientsForRecipe,
    addIngredientsToRecipe,
    deleteIngredientsFromRecipe,
    searchRecipe,
    getDailyRecipes
} from '../../controller/recipesController';

const router = express.Router();

// Route: ../version/recipes
router.route('/')
    .get(getAllRecipes)
    .post(createRecipe)
    .put(updateRecipe)
    .delete(deleteRecipe)

router.route('/daily')
    .get(getDailyRecipes)

router.route('/search')
    .get(searchRecipe)

router.route('/ingredients')
    .post(addIngredientsToRecipe)
    .delete(deleteIngredientsFromRecipe)

router.route('/ingredients/:recipeId')
    .get(getIngredientsForRecipe)

module.exports = router;