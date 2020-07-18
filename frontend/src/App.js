import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import theme from './styles/muiTheme'
import NavBar from './components/NavBar'
import AppBody from './components/AppBody'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastProvider } from 'react-toast-notifications'

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <ToastProvider
          autoDismiss
          autoDismissTimeout={7000}
          placement="bottom-right"
        >
          <Router>
            <NavBar />
            <AppBody />
          </Router>
        </ToastProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
