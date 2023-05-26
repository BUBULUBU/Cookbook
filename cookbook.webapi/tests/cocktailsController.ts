import * as supertest from 'supertest';
import {describe, expect, test} from '@jest/globals';
import config from '../src/config/config';

const request = supertest("http://localhost:3500");

describe('API Tests for CocktailsController', () => {
    // Test for getting all ingredients
    test('Get Cocktails', async () => {
        const response = await request
            .get('/api/' + config.VERSION + '/cocktails');

        expect(response.status).toBe(200);
    });
});