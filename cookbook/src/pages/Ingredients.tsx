// common
import React, {ReactElement, FC, useEffect, useState} from 'react';

// axios
import axios from '../api/axios';

// config
import configData from '../config.json';

// components
import IngredientReviewCard from '../components/Other/Ingredients/IngredientReviewCard';
import CreateIngredientDialog from "../components/Other/Ingredients/CreateIngredientDialog";

// mui
import {Grid, Typography} from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Ingredients: FC<any> = (): ReactElement => {
    const [ingredients, setIngredients] = useState([]);
    const [dialogIsOpen, setDialogIsOpen] = React.useState(false);

    const openCreationDialog = () => setDialogIsOpen(true);
    const closeCreationDialog = () => setDialogIsOpen(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getRecipes = async () => {
            try {
                const response = await axios.get('/api/' + configData.API_VERSION + '/ingredients', {
                    signal: controller.signal
                });

                isMounted && setIngredients(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        getRecipes().then(() => {
            return () => {
                isMounted = false;
                controller.abort();
            }
        })
    }, [])

    return (
        <Container sx={{mb: 4, mt: 4}}>
            <Typography variant="h4" align="center" mb={2}>
                Zutaten
            </Typography>

            <Grid container justifyContent="flex-end" mb={2}>
                <IconButton aria-label="delete" size="large" onClick={openCreationDialog}>
                    <AddCircleIcon/>
                </IconButton>
            </Grid>

            <Grid container spacing={2}>
                {ingredients.map((ingredient, index) => (
                    <Grid item xs={6} key={index}>
                        <IngredientReviewCard id={ingredient["iid"]} name={ingredient["name"]} description={ingredient["description"]} picture={ingredient["picture"]}/>
                    </Grid>
                ))}
            </Grid>

            <CreateIngredientDialog open={dialogIsOpen} onClose={closeCreationDialog}/>
        </Container>
    )
};

export default Ingredients;