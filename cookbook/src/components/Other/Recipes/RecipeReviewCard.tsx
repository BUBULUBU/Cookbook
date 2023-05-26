import * as React from 'react';
import {styled} from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, {IconButtonProps} from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PropTypes from 'prop-types';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from '../../../api/axios';
import configData from '../../../config.json';
import {Backdrop, CircularProgress} from '@mui/material';
import {useNavigate} from 'react-router-dom';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const {expand, ...other} = props;
    return <IconButton {...other} />;
})(({theme, expand}) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

const RecipeReviewCard = (props: {
    id: number,
    name: string,
    description: string,
    steps: string,
    picture: string,
    rating: number,
    kcal: number
}) => {
    const navigate = useNavigate();

    const [expanded, setExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [backdrop, setBackdrop] = React.useState(false);

    const isRecipeMenuOpen = Boolean(anchorEl);
    const cardOptions = [
        {name: "Bearbeiten", handler: () => handleEditRecipe},
        {name: "Löschen", handler: () => handleDeleteRecipe}
    ];

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleRecipeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleRecipeMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEditRecipe = () => {
        navigate(`/recipes/${props.id}`, {
            state: {
                name: props.name,
                description: props.description,
                steps: props.steps,
                picture: props.picture,
                rating: props.rating,
                kcal: props.kcal
            }
        });
    }

    const handleDeleteRecipe = async () => {
        handleRecipeMenuClose();
        setBackdrop(true);

        await axios.delete('/api/' + configData.API_VERSION + '/recipes', {data: {"rid": props.id}});

        window.location.reload();
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
                    <IconButton aria-label="settings" onClick={handleRecipeMenuOpen}>
                        <MoreVertIcon/>
                    </IconButton>
                }
                title={props.name}
                style={{overflow: "hidden"}}
                subheader={"Kcal: " + props.kcal + " (Bewertung: " + props.rating + ")"}
            />
            <Menu
                anchorEl={anchorEl}
                keepMounted onClose={handleRecipeMenuClose}
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
            <CardActions disableSpacing>
                <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                >
                    <ExpandMoreIcon/>
                </ExpandMore>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    <Typography paragraph>Schritte:</Typography>
                    <Typography paragraph>
                        {props.steps}
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    );
}

RecipeReviewCard.propTypes = {
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    steps: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    kcal: PropTypes.number.isRequired
};

export default RecipeReviewCard;