// common
import React, {ReactElement, FC} from 'react';
import {Link as RouterLink} from 'react-router-dom';

// mui
import {Box, Stack, Typography} from '@mui/material';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

const NotFound: FC<any> = (): ReactElement => {
    return (
        <Container sx={{mb: 4, mt: 4}}>
            <Stack alignItems="center" spacing={4}>
                <Typography variant="h2" paragraph>
                    Seite nicht gefunden!
                </Typography>

                <Box
                    component="img"
                    src="/assets/pages/NotFound/404.png"
                    sx={{height: 260, mx: 'auto', my: {xs: 5, sm: 10}}}
                />

                <Typography sx={{color: 'text.secondary'}}>
                    Sorry, leider konnten wir die von Ihnen gesuchte Seite nicht finden.
                </Typography>

                <Button to="/" size="large" variant="contained" component={RouterLink}>
                    Zurück zur Startseite
                </Button>
            </Stack>
        </Container>
    );
};

export default NotFound;