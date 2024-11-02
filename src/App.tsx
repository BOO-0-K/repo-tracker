import { Reset } from 'styled-reset';
import Router from './Router';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import { darkTheme, lightTheme } from './theme';
import { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    font-weight: 300;
    font-family: 'Source Sans Pro', sans-serif;
    background-color: ${(props) => props.theme.bgColor};
    color: ${(props) => props.theme.textColor};
    line-height: 1.2;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
`

function App() {
  const [isDark, setIsDark] = useState(true);
  const toggleDark = () => setIsDark((current) => !current);

  return (
    <>
      <HelmetProvider>
        <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
          <Reset />
          <GlobalStyle />
          <Router isDark={isDark} toggleDark={toggleDark} />
        </ThemeProvider>
      </HelmetProvider>
    </>
  );
}

export default App;
