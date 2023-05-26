// common
import React, {FC, ReactNode} from 'react';

// mui
import {Box, CssBaseline} from '@mui/material';

// components
import ResponsiveAppBar from './ResponsiveAppBar';

interface LayoutProps {
    children: ReactNode;
}

const Layout: FC<LayoutProps> = ({children}) => {
    return (
        <>
            <CssBaseline/>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    minHeight: "100vh",
                    maxWidth: "100vw",
                    flexGrow: 1,
                }}
            >
                <ResponsiveAppBar/>
                {children}
            </Box>
        </>
    );
};

export default Layout;