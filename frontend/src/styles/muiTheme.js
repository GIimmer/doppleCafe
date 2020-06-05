import { createMuiTheme } from '@material-ui/core/styles'
import variables from './styles.scss'

const theme = createMuiTheme({
    palette: {
        primary: {
            main: variables.primary,
            
        },
        secondary: {
            main: variables.secondary,
        },
        info: {
            main: variables.lightTeal,
        },
        success: {
            main: variables.mintCream,
        },
        warning: {
            main: variables.peach
        }
    },
});

export default theme;
