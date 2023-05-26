// common
import React, {ReactElement, FC, useEffect} from 'react';
import {useParams, useLocation, useNavigate} from 'react-router-dom';

// axios
import axios from '../api/axios';

// config
import configData from '../config.json';

// mui
import {Grid, Stack, TextField, Typography} from '@mui/material';
import Container from '@mui/material/Container';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '@mui/material/Button';

const EditIngredient: FC<any> = (): ReactElement => {
    const navigate = useNavigate();
    const {id} = useParams();
    const {state} = useLocation();

    const {name, description, picture} = state;

    const [ingredientData, setIngredientData] = React.useState(state);
    const [nameValidate, setNameValidate] = React.useState({length: name.length, valid: true});
    const [descriptionValidate, setDescriptionValidate] = React.useState({length: description.length, valid: true});

    const handleDataChange = (e: any) => {
        let value = e.target.value;

        if (e.target.name === "name") {
            setNameValidate({...nameValidate, length: value.length});
        }

        if (e.target.name === "description") {
            setDescriptionValidate({...descriptionValidate, length: value.length});
        }

        setIngredientData({
            ...ingredientData,
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

        await axios.put('/api/' + configData.API_VERSION + '/ingredients', {
            iid: id,
            update: ingredientData
        });

        navigate('/ingredients');
    }

    const handleCancel = () => {
        navigate('/ingredients');
    }

    return (
        <Container sx={{mb: 4, mt: 4}}>
            <Typography variant="h4" align="center" mb={2}>
                Bearbeite Zutat: {name}
            </Typography>

            <Stack spacing={2}>
                <TextField id="outlined-basic" label="Name" variant="outlined" defaultValue={name} name="name"
                           onChange={handleDataChange} error={!nameValidate.valid} required/>
                <TextField id="outlined-basic" label="Beschreibung" variant="outlined" defaultValue={description}
                           name="description" onChange={handleDataChange} error={!descriptionValidate.valid} required/>
                <TextField id="outlined-basic" label="Bild" variant="outlined" defaultValue={picture} name="picture"
                           onChange={handleDataChange}/>
            </Stack>

            <Grid container justifyContent="flex-end" mt={2} spacing={2}>
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
        </Container>
    );
};

export default EditIngredient;