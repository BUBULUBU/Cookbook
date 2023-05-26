// validation
import {Schema} from '../validation/validate';

export class Ingredient {
    name: string
    description: string
    picture: string
}

export const IngredientSchema : Schema = {
    fields: {
        name: 'string',
        description: 'string',
        picture: 'string'
    },
    required : ['name', 'description', 'picture']
}