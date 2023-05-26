// common
import React, {ReactElement, FC, useEffect} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';

// axios
import axios from '../api/axios';

// config
import configData from '../config.json';

// components
import IngredientsList from '../components/IngredientsList/IngredientsList';
import AddIngredientToRecipeDialog from "../components/Other/Recipes/AddIngredientToRecipeDialog";

// mui
import {Grid, Stack, TextField, Typography} from '@mui/material';
import Container from '@mui/material/Container';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

const EditRecipe: FC<any> = (): ReactElement => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {state} = useLocation();

    const {name, description, steps, picture, rating, kcal} = state;

    const [recipeData, setRecipeData] = React.useState(state);
    const [allIngredients, setAllIngredients] = React.useState([]);
    const [linkedIngredients, setLinkedIngredients] = React.useState([]);
    const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
    const [excludedIngredients, setExcludedIngredients] = React.useState([]);

    const [nameValidate, setNameValidate] = React.useState({length: name.length, valid: true});
    const [descriptionValidate, setDescriptionValidate] = React.useState({length: description.length, valid: true});

    const openIngredientDialog = () => {
        const excludedArray = allIngredients.filter((leftItem: any) => !linkedIngredients.some((rightItem: any) => rightItem.iid === leftItem.iid));

        setExcludedIngredients(excludedArray);

        setDialogIsOpen(true);
    }
    const closeIngredientDialog = () => setDialogIsOpen(false);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getLinkedData = async () => {
            try {
                const response = await axios.get('/api/' + configData.API_VERSION + `/recipes/ingredients/${id}`, {
                    signal: controller.signal
                });

                isMounted && setLinkedIngredients(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        getLinkedData().then(() => {
            return () => {
                isMounted = false;
                controller.abort();
            }
        })

        const getIngredientsData = async () => {
            try {
                const response = await axios.get('/api/' + configData.API_VERSION + `/ingredients`, {
                    signal: controller.signal
                });

                isMounted && setAllIngredients(response.data);
            } catch (err) {
                console.error(err);
            }
        }

        getIngredientsData().then(() => {
            return () => {
                isMounted = false;
                controller.abort();
            }
        })
    }, [dialogIsOpen])

    useEffect(() => {
        const excludedArray = allIngredients.filter((leftItem: any) => !linkedIngredients.some((rightItem: any) => rightItem.iid === leftItem.iid));

        setExcludedIngredients(excludedArray);
    }, [allIngredients, linkedIngredients])

    const handleDataChange = (e: any) => {
        let value = e.target.value;

        if (e.target.name === "name") {
            setNameValidate({...nameValidate, length: value.length});
        }

        if (e.target.name === "description") {
            setDescriptionValidate({...descriptionValidate, length: value.length});
        }

        if (e.target.name === "rating" || e.target.name === "kcal") {
            if (value <= 0) value = 0;
        }

        if (e.target.name === "rating") {
            if (value > 5) value = 5;
        }

        setRecipeData({
            ...recipeData,
            [e.target.name]: value
        });
    }

    const handleSave = async () => {
        if (nameValidate.length <= 0) {
            setNameValidate({...nameValidate, valid: false});

            return;
        }

        if (descriptionValidate.length <= 0) {
            setDescriptionValidate({...descriptionValidate, valid: false});

            return;
        }

        await axios.put('/api/' + configData.API_VERSION + '/recipes', {
            rid: id,
            update: recipeData
        });

        navigate('/recipes');
    }

    const handleCancel = () => {
        navigate('/recipes');
    }

    return (
        <Container sx={{mb: 4, mt: 4}}>
            <Typography variant="h4" align="center" mb={2}>
                Bearbeite Rezept: {name}
            </Typography>

            <Stack spacing={2}>
                <TextField id="outlined-basic" label="Name" variant="outlined" defaultValue={name} name="name"
                           onChange={handleDataChange} error={!nameValidate.valid} required/>
                <TextField id="outlined-basic" label="Beschreibung" variant="outlined" defaultValue={description}
                           name="description" onChange={handleDataChange} error={!descriptionValidate.valid} required/>
                <TextField id="outlined-basic" label="Schritte" variant="outlined" defaultValue={steps} name="steps"
                           onChange={handleDataChange}/>
                <TextField id="outlined-basic" label="Bild" variant="outlined" defaultValue={picture} name="picture"
                           onChange={handleDataChange}/>
                <TextField id="outlined-basic" label="Bewertung" variant="outlined" defaultValue={rating}
                           name="rating" type="number" InputProps={{inputProps: {min: 0, max: 5}}}
                           onChange={handleDataChange}/>
                <TextField id="outlined-basic" label="Kcal" variant="outlined" defaultValue={kcal} name="kcal"
                           type="number"
                           onChange={handleDataChange}/>

                <Typography variant="h5" align="left" mb={2}>
                    Zutaten:
                </Typography>

                {linkedIngredients && linkedIngredients?.length ? (
                    <IngredientsList recipeId={id} options={linkedIngredients}/>
                ) : <p>Keine Zutaten zugewiesen!</p>}
            </Stack>

            <Grid container justifyContent="flex-end" mt={2} spacing={2}>
                <Grid item>
                    <Button variant="contained" startIcon={<AddIcon/>} onClick={openIngredientDialog}>
                        Zutat hinzufügen
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" startIcon={<SaveIcon/>} onClick={handleSave}>
                        Speichern
                    </Button>
                </Grid>
                <Grid item>
                    <Button variant="outlined" startIcon={<CancelIcon/>} onClick={handleCancel}>
                        Abbrechen
                    </Button>
                </Grid>
            </Grid>

            <AddIngredientToRecipeDialog rid={id} filteredIngredients={excludedIngredients}
                                         open={dialogIsOpen} onClose={closeIngredientDialog}/>
        </Container>
    );
};

export default EditRecipe;