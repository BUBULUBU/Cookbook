// express
import express from 'express';

// controller
import {getCocktails} from '../../controller/cocktailsController';

const router = express.Router();

// Route: ../version/ingredients
router.route('/')
    .get(getCocktails)

module.exports = router;