import { createTheme } from '@mui/material/styles';
import { red, orange } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    warning: {
      main: orange[500],
    },
  },
  components: {
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: '#293264',
          padding: '4px 24px',
          border: '1px solid !important',
          borderRadius: '0',
          fontSize: 'medium',
          '&.Mui-selected': {
            backgroundColor: '#556cd6',
            border: '1px solid !important',
            borderColor: '#556cd6 !important',
            color: '#fff',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#556cd6',
            border: '1px solid !important',
            borderColor: '#556cd6 !important',
            color: '#fff',
          },
          '&:hover': {
            backgroundColor: '#556cd6',
            border: '1px solid !important',
            borderColor: '#556cd6 !important',
            color: '#fff',
          },
        },
      },
    },
  },
});

export default theme;
