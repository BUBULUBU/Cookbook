// common
import HttpStatusCode from '../class/HttpStatusCode';

// axios
import axios from 'axios';

const getCocktails = async (req, res) => {
    try {
        const response = await axios.get('http://www.thecocktaildb.com/api/json/v1/1/filter.php?c=Cocktail');

        return res.status(HttpStatusCode.OK).json(response.data);
    } catch (err) {
        throw err;
    }
}

export {getCocktails}