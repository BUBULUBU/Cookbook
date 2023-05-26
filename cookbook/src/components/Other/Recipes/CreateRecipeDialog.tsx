import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Stack, TextField} from '@mui/material';
import axios from '../../../api/axios';
import configData from '../../../config.json';

export default function CreateRecipeDialog(props: any) {
    const {open, onClose} = props;

    const [recipeData, setRecipeData] = React.useState({
        name: "",
        description: "",
        picture: "",
        steps: "",
        rating: 0,
        kcal: 0
    });

    const [name, setName] = React.useState({length: 0, valid: true});
    const [description, setDescription] = React.useState({length: 0, valid: true});

    const handleDataChange = (e: any) => {
        let value = e.target.value;

        if (e.target.name === "rating" || e.target.name === "kcal") value = Number(value);

        if (e.target.name === "name") {
            setName({...name, length: value.length});
        }

        if (e.target.name === "description") {
            setDescription({...description, length: value.length});
        }

        if (e.target.name === "rating") {
            if (value > 5) value = 5;
        }

        setRecipeData({
            ...recipeData,
            [e.target.name]: value
        });
    }

    const handleAddRecipe = async () => {
        if (name.length <= 0) {
            setName({...name, valid: false});

            return;
        }

        if (description.length <= 0) {
            setDescription({...description, valid: false});

            return;
        }

        const response = await axios.post('/api/' + configData.API_VERSION + '/recipes', recipeData);

        if (!response) console.error(response);

        window.location.reload();
    };

    return (
        <>
            <Dialog
                fullWidth
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Rezept erstellen
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <TextField id="outlined-basic" label="Name" variant="outlined" name="name"
                                   onChange={handleDataChange} error={!name.valid} required/>
                        <TextField id="outlined-basic" label="Beschreibung" variant="outlined"
                                   name="description" onChange={handleDataChange} error={!description.valid} required/>
                        <TextField id="outlined-basic" label="Schritte" variant="outlined" name="steps"
                                   onChange={handleDataChange}/>
                        <TextField id="outlined-basic" label="Bild" variant="outlined" name="picture"
                                   onChange={handleDataChange}/>
                        <TextField id="outlined-basic" label="Bewertung" variant="outlined" type="number" name="rating"
                                   onChange={handleDataChange} InputProps={{inputProps: {min: 0, max: 5}}}/>
                        <TextField id="outlined-basic" label="Kcal" variant="outlined" type="number" name="kcal"
                                   onChange={handleDataChange}/>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleAddRecipe} autoFocus>
                        Hinzufügen
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}