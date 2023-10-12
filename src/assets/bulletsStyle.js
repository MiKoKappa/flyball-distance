import { createTheme } from '@mui/material/styles';

export const bulletsTheme = createTheme({
    palette: {
        primary: {
            light: '#d2db55',
            main: '#c7d32b',
            dark: '#8b931e',
            contrastText: '#000',
        },
        secondary: {
            light: '#7f7f7f',
            main: '#5f5f5f',
            dark: '#424242',
            contrastText: '#fff',
        },
    },
});