import * as supertest from 'supertest';
import {afterAll, describe, expect, test} from '@jest/globals';
import config from '../src/config/config';

const request = supertest("http://localhost:3500");

let createdRecipeId = 0;

describe('API Tests for RecipesController', () => {
    afterAll(async () => {
        // Cleanup for recipe
        await request
            .delete('/api/' + config.VERSION + '/recipes')
            .send({
                rid: createdRecipeId,
            });
    })

    // Test for creating a recipe
    test('Create Recipe', async () => {
        const response = await request
            .post('/api/' + config.VERSION + '/recipes')
            .send({
                name: 'Test',
                description: 'blalbal',
                picture: 'urlOfPicture',
                steps: 'blabla',
                rating: 4,
                kcal: 382,
            });

        createdRecipeId = response.body.message;

        expect(response.status).toBe(201);
    });

    // Test for updating a recipe
    test('Update Recipe', async () => {
        const response = await request
            .put('/api/' + config.VERSION + '/recipes')
            .send({
                rid: createdRecipeId,
                update: {
                    name: 'Hallo',
                    kcal: 100,
                    description: 'dwadwa',
                },
            });

        expect(response.status).toBe(200);
    });

    // Test for getting all recipes
    test('Get Recipes', async () => {
        const response = await request
            .get('/api/' + config.VERSION + '/recipes');

        expect(response.status).toBe(200);
    });

    // Test for getting daily recipes
    test('Get Daily Recipes', async () => {
        const response = await request
            .get('/api/' + config.VERSION + '/recipes/daily');

        expect(response.status).toBe(200);
    });

    // Test for searching recipes by name
    test('Search Recipe by Name', async () => {
        const response = await request
            .get('/api/' + config.VERSION + '/recipes')
            .query({search: 'Test'});

        expect(response.status).toBe(200);
    });

    // Test for adding ingredients to a recipe
    test('Add Ingredients to Recipe', async () => {
        const ingredientsResponse = await request
            .get('/api/' + config.VERSION + '/ingredients');

        const response = await request
            .post('/api/' + config.VERSION + '/recipes/ingredients')
            .send({
                recipeId: createdRecipeId,
                ingredients: [
                    {
                        ingredientId: ingredientsResponse.body[0].iid,
                        amount: 3,
                        unit: 'g'
                    }
                ],
            });

        expect(response.status).toBe(200);
    });

    // Test for getting all ingredients for a recipe
    test('Get All Ingredients For Recipe', async () => {
        const response = await request
            .get('/api/' + config.VERSION + '/recipes/ingredients/' + createdRecipeId);

        expect(response.status).toBe(200);
    });

    test('Delete Ingredient from Recipe', async () => {
        const ingredientsResponse = await request
            .get('/api/' + config.VERSION + '/ingredients');

        await request
            .delete('/api/' + config.VERSION + '/recipes/ingredients')
            .send({
                recipeId: createdRecipeId,
                ingredientIds: [ingredientsResponse.body[0].iid]
            });
    })
});