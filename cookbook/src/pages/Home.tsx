// common
import React, {ReactElement, FC} from 'react';

// mui
import {Box, Stack, Typography} from '@mui/material';
import Container from '@mui/material/Container';

const Home: FC<any> = (): ReactElement => {
    return (
        <Container sx={{mb: 4, mt: 4}}>
            <Stack alignItems="center" spacing={4}>
                <Typography variant="h4" align="center">
                    Nur eine leere Startseite..
                </Typography>

                <Typography variant="h6" align="center">
                    Tipp: Schau doch mal in die Navigation
                </Typography>

                <Box
                    component="img"
                    src="/assets/pages/Home/smiley.png"
                    sx={{height: 260, mx: 'auto', my: {xs: 5, sm: 10}}}
                />
            </Stack>
        </Container>
    );
};

export default Home;