// common
import HttpStatusCode from '../class/HttpStatusCode';

// schemas
import {Ingredient, IngredientSchema} from '../class/Ingredient';

// middleware
import {Database} from '../middleware/database';

// validation
import {validate} from '../validation/validate';

// syntax builder
import squel from 'safe-squel';

const db = new Database();

const getIngredients = async (req, res) => {
    try {
        const result = await db.Query('SELECT * FROM ingredients');

        return res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
        throw err;
    }
}

const createIngredient = async (req, res) => {
    try {
        const convertedIngredient = req.body as Ingredient;
        const status = await validate(req.body, IngredientSchema);

        if (!status) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        const result = await db.Query('INSERT INTO ingredients (name, description, picture) VALUES (?, ?, ?)', [convertedIngredient.name, convertedIngredient.description, convertedIngredient.picture]);

        if (!result) return res.status(HttpStatusCode.CONFLICT).json({message: "Could not create ingredient!"});

        return res.status(HttpStatusCode.CREATED).json({message: Number(result["insertId"]).toString()});
    } catch (err) {
        throw err;
    }
}

const deleteIngredient = async (req, res) => {
    try {
        const ingredientId = req.body.iid;

        if (!ingredientId) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        const result = await db.Query('DELETE FROM ingredients WHERE iid = ?', ingredientId)

        if (!result) return res.status(HttpStatusCode.NOT_FOUND).json({message: `Could not delete ingredient with ID ${ingredientId}!`});

        return res.status(HttpStatusCode.NO_CONTENT).json({message: `Ingredient ID ${ingredientId} has been deleted!`});
    } catch (err) {
        throw err;
    }
}

const updateIngredient = async (req, res) => {
    try {
        const ingredientId = req.body.iid;

        if (!ingredientId) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});
        if (!req.body.update) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});
        if (!req.body.update.name) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        const sqlQuery = squel.update()
            .table('ingredients')
            .setFields(req.body.update)
            .where("iid = ?", ingredientId)
            .toString();

        let result;

        try {
            result = await db.Query(sqlQuery, []);
        } catch (err) {
            return res.status(HttpStatusCode.NOT_FOUND).json({message: `Could not update ingredient with ID ${ingredientId}!`});
        }

        if (!result) return res.status(HttpStatusCode.NOT_FOUND).json({message: `Could not update ingredient with ID ${ingredientId}!`});

        return res.status(HttpStatusCode.OK).json({message: `Updated Ingredient ID ${ingredientId} successfully!`});
    } catch (err) {
        throw err;
    }
}

const getAllRecipesForIngredient = async (req, res) => {
    try {
        const searchIngredient = req.params.ingredient;

        if (!searchIngredient) return res.status(HttpStatusCode.BAD_REQUEST).json({message: "Request body is incorrect!"});

        const result = await db.Query('SELECT r.name, r.rid FROM ingredients i LEFT JOIN recipe_contains_ingredient rci ON i.iid = rci.iid LEFT JOIN recipes r ON rci.rid = r.rid WHERE i.name = ? AND r.rid IS NOT NULL;', [searchIngredient]);

        return res.status(HttpStatusCode.OK).json(result);
    } catch (err) {
        throw err;
    }
}

export {getIngredients, createIngredient, deleteIngredient, updateIngredient, getAllRecipesForIngredient}