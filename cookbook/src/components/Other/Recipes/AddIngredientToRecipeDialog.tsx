import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {Select, SelectChangeEvent, Stack, TextField} from '@mui/material';
import axios from '../../../api/axios';
import configData from '../../../config.json';
import MenuItem from '@mui/material/MenuItem';
import {useEffect} from 'react';

export default function AddIngredientToRecipeDialog(props: any) {
    const {rid, filteredIngredients, open, onClose} = props;

    const [openSelect, setSelectOpen] = React.useState(false);
    const [ingredient, setIngredient] = React.useState('');
    const [ingredientData, setIngredientData] = React.useState({
        rid: rid,
        iid: 0,
        amount: 0,
        unit: "g"
    });
    const [ingredientValidate, setIngredientValidate] = React.useState({length: 0, valid: true});
    const [amountValidate, setAmountValidate] = React.useState({length: 1, valid: true});
    const [unitValidate, setUnitValidate] = React.useState({length: 1, valid: true});

    const handleSelectClose = () => {
        setSelectOpen(false);
    };

    const handleSelectOpen = () => {
        setSelectOpen(true);
    };

    const handleChangeText = ((e: any) => {
        let value = e.target.value;

        if (e.target.name === "amount") {
            setAmountValidate({...amountValidate, length: value.length});
        }

        if (e.target.name === "unit") {
            setUnitValidate({...unitValidate, length: value.length});
        }

        setIngredientData({
            ...ingredientData,
            [e.target.name]: value
        });
    });

    const handleChangeSelect = ((e: any) => {
        let value = e.target.value;

        setIngredient(value);

        if (e.target.name === "iid") {
            setIngredientValidate({...ingredientValidate, length: value.length});
        }

        setIngredientData({
            ...ingredientData,
            [e.target.name]: value
        });
    });

    const handleAddIngredient = async () => {
        if (ingredientValidate.length <= 0) {
            setIngredientValidate({...ingredientValidate, valid: false});

            return;
        }

        if (amountValidate.length <= 0) {
            setAmountValidate({...amountValidate, valid: false});

            return;
        }

        if (unitValidate.length <= 0) {
            setUnitValidate({...unitValidate, valid: false});

            return;
        }

        const response = await axios.post('/api/' + configData.API_VERSION + '/recipes/ingredients', {
            "recipeId": Number(rid),
            "ingredients": [
                {
                    "ingredientId": Number(ingredientData.iid),
                    "amount": Number(ingredientData.amount),
                    "unit": ingredientData.unit
                }
            ]
        });

        if (!response) {
            console.error(response);
        } else {
            window.location.reload();
        }
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
                    Zutat hinzufügen
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2}>
                        <Select
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            open={openSelect}
                            onClose={handleSelectClose}
                            onOpen={handleSelectOpen}
                            value={ingredient}
                            label="Zutat"
                            name="iid"
                            onChange={handleChangeSelect}
                            error={!ingredientValidate.valid}
                            required
                        >
                            <MenuItem key="" value="">
                                <em>None</em>
                            </MenuItem>

                            {filteredIngredients.map((ingredient: any) => {
                                return (
                                    <MenuItem key={ingredient.iid} value={ingredient.iid}>
                                        {ingredient.name}
                                    </MenuItem>
                                )
                            })}
                        </Select>

                        <TextField id="outlined-basic" label="Anzahl" variant="outlined" name="amount"
                                   defaultValue={ingredientData.amount} type="number"
                                   onChange={handleChangeText} error={!amountValidate.valid} required/>
                        <TextField id="outlined-basic" label="Einheit" variant="outlined" name="unit"
                                   defaultValue={ingredientData.unit}
                                   onChange={handleChangeText} error={!unitValidate.valid} required/>
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