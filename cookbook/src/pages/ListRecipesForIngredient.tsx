// common
import React, {ReactElement, FC, useEffect} from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';

// axios
import axios from '../api/axios';

// config
import configData from '../config.json';

// components
import RecipesList from '../components/RecipesList/RecipesList';

// mui
import {Grid, Stack, Typography} from '@mui/material';
import Container from '@mui/material/Container';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';

const EditIngredient: FC<any> = (): ReactElement => {
    const navigate = useNavigate();
    const {name} = useParams();
    const {state} = useLocation();

    const {id} = state;

    const [recipes, setRecipes] = React.useState([]);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getRecipes = async () => {
            try {
                const response = await axios.get('/api/' + configData.API_VERSION + `/ingredients/${name}`, {
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

    const handleReturn = (() => {
        navigate('/ingredients');
    })

    return (
        <Container sx={{mb: 4, mt: 4}}>
            <Typography variant="h4" align="center" mb={2}>
                Zutat: {name}
            </Typography>

            <Typography variant="h5" mb={2}>
                Verfügbare Rezepte:
            </Typography>

            <Stack spacing={2}>
                {recipes && recipes.length ? (
                    <RecipesList recipeId={id} options={recipes}/>
                ) : <p>Keine Rezepte zugewiesen!</p>}
            </Stack>

            <Grid container justifyContent="flex-end" mt={2} spacing={2}>
                <Grid item>
                    <Button variant="contained" startIcon={<ArrowBackIcon/>} onClick={handleReturn}>
                        Zurück
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
};

export default EditIngredient;