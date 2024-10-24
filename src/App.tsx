import { Reset } from 'styled-reset';
import Router from './Router';
import { createGlobalStyle } from 'styled-components';

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
  return (
    <>
      <Reset />
      <GlobalStyle />
      <Router />
    </>
  );
}

export default App;
