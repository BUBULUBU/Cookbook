// validation
import {Schema} from '../validation/validate';

export class Recipe {
    name: string
    description: string
    picture: string
    steps: string
    rating: number
    kcal: number
}

export const RecipeSchema : Schema = {
    fields: {
        name: 'string',
        description: 'string',
        picture: 'string',
        steps: 'string',
        rating: 'number',
        kcal: 'number'
    },
    required : ['name', 'description', 'rating', 'kcal']
}