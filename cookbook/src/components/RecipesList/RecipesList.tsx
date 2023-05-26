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

export default function RecipesList(props: any) {
    const {recipeId, options} = props;

    const [list, setList] = React.useState(options);

    return (
        <Box
            sx={{width: '100%', height: 300, bgcolor: 'background.paper', overflowY: "scroll"}}
        >
            <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                {list.map((recipe: any) => (
                    <ListItem
                        key={recipeId}
                        disableGutters
                    >
                        <ListItemText primary={`${recipe.name}`}/>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}