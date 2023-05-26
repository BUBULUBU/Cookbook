import express from 'express';
import cors from 'cors';
import {corsOptions} from './config/corsOptions';
import {logger} from './middleware/logEvents';
import errorHandler from './middleware/errorHandler';
import * as dotenv from 'dotenv';
import config from './config/config';

dotenv.config();

const PORT = process.env.PORT || 3500;
const app = express();

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware to handle urlencoded data
// in other words, form data:
// `content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({extended: false}));

// built-in middleware for json
app.use(express.json());

// routes
app.use('/api/' + config.VERSION + '/recipes', require('./routes/api/recipes'));
app.use('/api/' + config.VERSION + '/ingredients', require('./routes/api/ingredients'));
app.use('/api/' + config.VERSION + '/cocktails', require('./routes/api/cocktails'));

app.all('*', (req, res) => {
    res.status(404);
})

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));