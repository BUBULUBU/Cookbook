// validation
import {Schema} from '../validation/validate';

export class IngredientLink {
    ingredientId: number
    amount: number
    unit: string
}

export const IngredientLinkSchema : Schema = {
    fields: {
        ingredientId: 'number',
        amount: 'number',
        unit: 'string'
    },
    required : ['ingredientId', 'amount', 'unit']
}