// common
import HttpStatusCode from '../class/HttpStatusCode';

// schemas
import {Recipe, RecipeSchema} from '../class/Recipe';
import {IngredientLinkSchema} from '../class/IngredientLink';

// middleware
import {Database} from '../middleware/database';

// validation
import {validate} from '../validation/validate';

// syntax builder
import squel from 'safe-squel';

const db = new Database();

const getAllRecipes = async (req, res) => {
    try {
        const result = await db.Query('SELECT * FROM recipes');

        return res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
        throw err;
    }
}

const createRecipe = async (req, res) => {
    try {
        const convertedRecipe = req.body as Recipe;
        const status = await validate(req.body, RecipeSchema);

        if (!status) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        const result = await db.Query('INSERT INTO recipes (name, description, picture, steps, rating, kcal) VALUES (?, ?, ?, ?, ?, ?)', [convertedRecipe.name, convertedRecipe.description, convertedRecipe.picture, convertedRecipe.steps, convertedRecipe.rating, convertedRecipe.kcal]);

        if (!result) return res.status(HttpStatusCode.CONFLICT).json({message: "Could not create recipe!"});

        return res.status(HttpStatusCode.CREATED).json({message: Number(result["insertId"]).toString()});
    } catch (err) {
        throw err;
    }
}

const updateRecipe = async (req, res) => {
    try {
        const recipeId = req.body.rid;

        if (!recipeId) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});
        if (!req.body.update) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});
        if (!req.body.update.name) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        if (req.body.update.rating && req.body.update.rating > 5) req.body.update.rating = 5;

        const sqlQuery = squel.update()
            .table('recipes')
            .setFields(req.body.update)
            .where("rid = ?", recipeId)
            .toString();

        let result;

        try {
            result = await db.Query(sqlQuery, []);
        } catch (err) {
            return res.status(HttpStatusCode.NOT_FOUND).json({message: `Could not update recipe id ${recipeId}!`});
        }

        if (!result) return res.status(HttpStatusCode.NOT_FOUND).json({message: `Could not update recipe id ${recipeId}!`});

        res.status(HttpStatusCode.OK).json({message: `Updated recipe id ${recipeId} successfully!`});
    } catch (err) {
        throw err;
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.body.rid;

        if (!recipeId) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        const result = await db.Query('DELETE FROM recipes WHERE rid = ?', recipeId)

        if (!result) return res.status(HttpStatusCode.NOT_FOUND).json({message: `Could not delete recipe with id ${recipeId}!`});

        return res.status(HttpStatusCode.NO_CONTENT).json({message: `Recipe id ${recipeId} has been deleted!`});
    } catch (err) {
        throw err;
    }
}

const getIngredientsForRecipe = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;

        if (!recipeId) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        const result = await db.Query('SELECT i.name, i.iid, rci.amount, rci.unit FROM recipes r LEFT JOIN recipe_contains_ingredient rci ON r.rid = rci.rid LEFT JOIN ingredients i ON rci.iid = i.iid WHERE r.rid = ? AND i.iid IS NOT NULL;', [recipeId]);

        return res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
        throw err;
    }
}

const addIngredientsToRecipe = async (req, res) => {
    try {
        const recipeId = req.body.recipeId;
        const ingredientsList = req.body.ingredients;

        if (!recipeId) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});
        if (!ingredientsList) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});
        if (ingredientsList.length <= 0) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        for (let ingredient of ingredientsList) {
            let status = await validate(ingredient, IngredientLinkSchema);

            if (!status) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

            let result;

            try {
                result = await db.Query('INSERT INTO recipe_contains_ingredient (rid, iid, amount, unit) VALUES (?, ?, ?, ?)', [recipeId, ingredient.ingredientId, ingredient.amount, ingredient.unit]);
            } catch (err) {
                return res.status(HttpStatusCode.NOT_FOUND).json({message: `Could not link ingredients to recipe id ${recipeId}!`});
            }

            if (!result) return res.status(HttpStatusCode.NOT_FOUND).json({message: `Could not link ingredients to recipe id ${recipeId}!`});
        }

        return res.status(HttpStatusCode.OK).json({message: `Added ingredients to recipe id ${recipeId}`});
    } catch (err) {
        throw err;
    }
}

const deleteIngredientsFromRecipe = async (req, res) => {
    try {
        const recipeId = req.body.recipeId;
        const ingredientIds = req.body.ingredientIds;

        if (!recipeId) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});
        if (!ingredientIds) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        if (!Array.isArray(ingredientIds)) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        for (let ingredientId of ingredientIds) {
            const result = await db.Query('DELETE FROM recipe_contains_ingredient WHERE rid = ? AND iid = ?', [recipeId, ingredientId]);

            if (!result) return res.status(HttpStatusCode.NOT_FOUND).json({message: "Could not delete ingredients from recipe!"});
        }

        return res.status(HttpStatusCode.NO_CONTENT).json({message: `Ingredient successfully delete from recipe with ID ${recipeId}`});
    } catch (err) {
        throw err;
    }
}

// Search Route

const searchRecipe = async (req, res) => {
    try {
        const searchQuery = req.query.q;

        if (!searchQuery) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        const result = await db.Query('SELECT * FROM recipes WHERE name LIKE ?', [`%${searchQuery}%`]);

        return res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
        throw err;
    }
}

// Custom Daily Recipe

const getDailyRecipes = async (req, res) => {
    try {
        const result = await db.Query('SELECT * FROM recipes ORDER by RAND() LIMIT 3');

        return res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
        throw err;
    }
}

export {
    getAllRecipes,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getIngredientsForRecipe,
    addIngredientsToRecipe,
    deleteIngredientsFromRecipe,
    searchRecipe,
    getDailyRecipes
}