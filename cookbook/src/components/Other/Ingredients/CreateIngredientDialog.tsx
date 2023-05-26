import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Stack, TextField} from '@mui/material';
import axios from '../../../api/axios';
import configData from '../../../config.json';

export default function CreateIngredientDialog(props: any) {
    const {open, onClose} = props;

    const [ingredientData, setIngredientData] = React.useState({
        name: "",
        description: "",
        picture: ""
    });

    const [name, setName] = React.useState({length: 0, valid: true});
    const [description, setDescription] = React.useState({length: 0, valid: true});
    const handleDataChange = (e: any) => {
        let value = e.target.value;

        if (e.target.name === "name") {
            setName({...name, length: value.length});
        }

        if (e.target.name === "description") {
            setDescription({...description, length: value.length});
        }

        setIngredientData({
            ...ingredientData,
            [e.target.name]: value
        });
    }

    const handleAddIngredient = async () => {
        if (name.length <= 0) {
            setName({...name, valid: false});

            return;
        }

        if (description.length <= 0) {
            setDescription({...description, valid: false});

            return;
        }

        const response = await axios.post('/api/' + configData.API_VERSION + '/ingredients', ingredientData);

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
                    Zutat erstellen
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <TextField id="outlined-basic" label="Name" variant="outlined" name="name"
                                   onChange={handleDataChange} error={!name.valid} required/>
                        <TextField id="outlined-basic" label="Beschreibung" variant="outlined"
                                   name="description" onChange={handleDataChange} error={!description.valid} required/>
                        <TextField id="outlined-basic" label="Bild" variant="outlined" name="picture"
                                   onChange={handleDataChange}/>
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleAddIngredient} autoFocus>
                        Hinzufügen
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}