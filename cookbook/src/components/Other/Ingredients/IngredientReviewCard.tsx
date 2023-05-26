import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from '../../../api/axios';
import configData from '../../../config.json';
import {Backdrop, CircularProgress} from '@mui/material';
import {useNavigate} from 'react-router-dom';

const IngredientReviewCard = (props: {
    id: number,
    name: string,
    description: string,
    picture: string
}) => {
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [backdrop, setBackdrop] = React.useState(false);

    const isRecipeMenuOpen = Boolean(anchorEl);
    const cardOptions = [
        {name: "Bearbeiten", handler: () => handleEditIngredient},
        {name: "Löschen", handler: () => handleDeleteIngredient},
        {name: "Rezepte anzeigen", handler: () => handleShowRecipes}
    ];

    const handleIngredientMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleIngredientMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditIngredient = () => {
        navigate(`/ingredients/${props.id}`, {
            state: {
                name: props.name,
                description: props.description,
                picture: props.picture
            }
        });
    }

    const handleDeleteIngredient = async () => {
        handleIngredientMenuClose();
        setBackdrop(true);

        await axios.delete('/api/' + configData.API_VERSION + '/ingredients', {data: {"iid": props.id}});

        window.location.reload();
    }

    const handleShowRecipes = () => {
        navigate(`/ingredients/recipes/${props.name}`, {
            state: {
                id: props.id
            }
        });
    }

    return (
        <Card>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={backdrop}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <CardHeader
                action={
                    <IconButton aria-label="settings" onClick={handleIngredientMenuOpen}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={props.name}
                style={{overflow: "hidden"}}
            />
            <Menu
                anchorEl={anchorEl}
                keepMounted onClose={handleIngredientMenuClose}
                open={isRecipeMenuOpen}>
                {cardOptions.map((option) => (
                    <MenuItem
                        key={option.name}
                        onClick={option.handler()}>
                        {option.name}
                    </MenuItem>
                ))}
            </Menu>
            <CardMedia
                component="img"
                height="164"
                image={props.picture}
                alt={props.name}
                sx={{objectFit: 'cover'}}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {props.description}
                </Typography>
            </CardContent>
        </Card>
    );
}

IngredientReviewCard.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
};

export default IngredientReviewCard;