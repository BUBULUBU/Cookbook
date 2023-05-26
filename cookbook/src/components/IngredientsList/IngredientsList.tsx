// common
import React from 'react';

// axios
import axios from "../../api/axios";

// config
import configData from "../../config.json";

// mui
import {
    Box,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function IngredientsList(props: any) {
    const {options} = props;

    const [list, setList] = React.useState(options);

    const handleDelete = (async (ingredientId: any) => {
        const newList = list.filter((item: any) => item.iid !== ingredientId);

        setList(newList);

        let ingredientIds = [ingredientId];

        await axios.delete('/api/' + configData.API_VERSION + '/recipes/ingredients', {
            data: {
                "recipeId": props.recipeId,
                "ingredientIds": ingredientIds
            }
        });
    })

    return (
        <Box
            sx={{width: '100%', height: 300, bgcolor: 'background.paper', overflowY: "scroll"}}
        >
            <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                {list.map((ingredient: any) => (
                    <ListItem
                        key={ingredient.iid}
                        disableGutters
                        secondaryAction={
                            <IconButton aria-label="comment" onClick={() => handleDelete(ingredient.iid)}>
                                <DeleteIcon/>
                            </IconButton>
                        }
                    >
                        <ListItemText primary={`${ingredient.name} (${ingredient.amount} ${ingredient.unit})`}/>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}