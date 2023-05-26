// default pages
import Home from './pages/Home';
import NotFound from './pages/NotFound';

// recipe pages
import Recipes from './pages/Recipes';
import EditRecipe from './pages/EditRecipe';

// ingredient pages
import Ingredients from './pages/Ingredients';
import EditIngredient from './pages/EditIngredient';
import ListRecipesForIngredient from './pages/ListRecipesForIngredient';
// other
import {FC} from 'react';

// interface
interface Route {
    key: string,
    title: string,
    path: string,
    enabled: boolean,
    component: FC
}

export const routes: Array<Route> = [
    {
        key: 'home-route',
        title: 'Home',
        path: '/',
        enabled: true,
        component: Home
    },
    {
        key: '404-route',
        title: '404',
        path: '/404',
        enabled: true,
        component: NotFound
    },
    {
        key: 'recipes-route',
        title: 'Rezepte',
        path: '/recipes',
        enabled: true,
        component: Recipes
    },
    {
        key: 'recipe-edit-route',
        title: 'Rezept bearbeiten',
        path: '/recipes/:id',
        enabled: true,
        component: EditRecipe
    },
    {
        key: 'ingredients-route',
        title: 'Zutaten',
        path: '/ingredients',
        enabled: true,
        component: Ingredients
    },
    {
        key: 'ingredient-edit-route',
        title: 'Zutat bearbeiten',
        path: '/ingredients/:id',
        enabled: true,
        component: EditIngredient
    },
    {
        key: 'ingredient-recipe-route',
        title: 'Rezepte für Zutat Liste',
        path: '/ingredients/recipes/:name',
        enabled: true,
        component: ListRecipesForIngredient
    },
]