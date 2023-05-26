import * as supertest from 'supertest';
import {afterAll, describe, expect, test} from '@jest/globals';
import config from '../src/config/config';

const request = supertest("http://localhost:3500");

let createdIngredientId;

describe('API Tests for IngredientsController', () => {
    // Test for creating an ingredient
    test('Create Ingredient', async () => {
        const response = await request
            .post('/api/' + config.VERSION + '/ingredients')
            .send({
                name: 'Test',
                description: 'Test',
                picture: 'test'
            });

        createdIngredientId = response.body.message;

        expect(response.status).toBe(201);
    });

    // Test for updating an ingredient
    test('Update Ingredient', async () => {
        const response = await request
            .put('/api/' + config.VERSION + '/ingredients')
            .send({
                iid: createdIngredientId,
                update: {
                    name: 'Carrot',
                    description: 'Blabla',
                    picture: 'otherpicture'
                },
            });

        expect(response.status).toBe(200);
    });


    // Test for getting all ingredients
    test('Get Ingredients', async () => {
        const response = await request
            .get('/api/' + config.VERSION + '/ingredients');

        expect(response.status).toBe(200);
    });

    // Test for getting certain ingredient
    test('Get All Recipes for Ingredient', async () => {
        const response = await request
            .get('/api/' + config.VERSION + '/ingredients/Carrot');

        expect(response.status).toBe(200);
    })

    // Test for deleting ingredient
    test('Delete Ingredient', async () => {
        await request
            .delete('/api/' + config.VERSION + '/ingredients')
            .send({
                iid: createdIngredientId
            });
    })
});