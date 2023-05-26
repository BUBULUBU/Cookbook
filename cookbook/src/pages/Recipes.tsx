// common
import React, {ReactElement, FC, useEffect} from 'react';

// axios
import axios from '../api/axios';

// config
import configData from '../config.json';

// components
import RecipeReviewCard from '../components/Other/Recipes/RecipeReviewCard';
import CreateRecipeDialog from '../components/Other/Recipes/CreateRecipeDialog';

// mui
import {Grid, TextField, Typography} from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';

const Recipes: FC<any> = (): ReactElement => {
    const [recipes, setRecipes] = React.useState([]);
    const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
    const [filteredArray, setFilteredArray] = React.useState([]);

    const openCreationDialog = () => setDialogIsOpen(true);
    const closeCreationDialog = () => setDialogIsOpen(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getRecipes = async () => {
            try {
                const response = await axios.get('/api/' + configData.API_VERSION + '/recipes', {
                    signal: controller.signal
                });

                isMounted && setRecipes(response.data);
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

    useEffect(() => {
        setFilteredArray(recipes);
    }, [recipes])

    const searchHandler = (async (event: any) => {
        let searchText = event.target.value;

        let response;

        if (searchText.length > 0) {
            response = await axios.get('/api/' + configData.API_VERSION + '/recipes/search', {
                params: {
                    q: searchText
                }
            });

            setFilteredArray(response.data);
        } else {
            setFilteredArray(recipes);
        }
    })

    return (
        <Container sx={{mb: 4, mt: 4}}>
            <Typography variant="h4" align="center" mb={2}>
                Rezepte
            </Typography>

            <TextField sx={{mb: 2}} id="outlined-basic" label="Suche" variant="outlined" fullWidth
                       onKeyDown={(ev) => {
                           if (ev.key === 'Enter') {
                               searchHandler(ev);
                           }
                       }}/>

            <Grid container justifyContent="flex-end" mb={2}>
                <IconButton aria-label="delete" size="large" onClick={openCreationDialog}>
                    <AddCircleIcon/>
                </IconButton>
            </Grid>

            <Grid container spacing={2}>
                {filteredArray?.map((recipe, index) => (
                    <Grid item xs={6} key={index}>
                        <RecipeReviewCard id={recipe["rid"]} name={recipe["name"]} description={recipe["description"]}
                                          kcal={recipe["kcal"]} picture={recipe["picture"]} rating={recipe["rating"]}
                                          steps={recipe["steps"]}/>
                    </Grid>
                ))}
            </Grid>

            <CreateRecipeDialog open={dialogIsOpen} onClose={closeCreationDialog}/>
        </Container>
    );
}

export default Recipes;