import React from 'react'
import { ThemeProvider } from '@material-ui/styles'
import theme from './styles/muiTheme'
import NavBar from './components/NavBar'
import AppBody from './components/AppBody'
import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Router>
          <NavBar />
          <AppBody />
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
