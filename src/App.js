import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from "styled-components";
import Main from './Main';
import { darkTheme } from './theme';

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: ${darkTheme.background};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  return (
      <Container>
          <Main/>
      </Container>
  );
  
}

export default App;