// express
import express from 'express';

// controller
import {
    getIngredients,
    createIngredient,
    deleteIngredient,
    updateIngredient,
    getAllRecipesForIngredient
} from '../../controller/ingredientsController';

const router = express.Router();

// Route: ../version/ingredients
router.route('/')
    .get(getIngredients)
    .post(createIngredient)
    .put(updateIngredient)
    .delete(deleteIngredient)

router.route('/:ingredient')
    .get(getAllRecipesForIngredient)

module.exports = router;