import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from "styled-components";
import Main from './Main';
import PotionSearch from './PotionSearch';
import { darkTheme } from './theme';

const Container = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  background: ${darkTheme.background};
  color: white;
  overflow-x: hidden;


  .switch-button {
      position: relative;
      display: flex;
      margin: auto;
      background: white;
      color: black;
      margin-top: 5px;
      margin-bottom: 2px;
      border-radius: 5px;
      font-weight: bold;

      :hover {
        background: ${darkTheme.background};
        outline: 1px solid white;
        color: white;
      }
  }
`;

function App() {
  const [mode, setMode] = useState(true)

  function handleSwitchMode() {
      setMode(!mode)
  }

  return (
      <Container>
          <Button className='switch-button' onClick={() => handleSwitchMode()}> { mode ? "Switch to potion search" : "Switch to crystal search" }</Button>
          { mode ? <Main/> : <PotionSearch/>}
      </Container>
  );
  
}

export default App;