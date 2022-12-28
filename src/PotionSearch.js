import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from './theme';


const Container = styled.div`
    position: relative;
    width: 98%;
    height: 95%;
    display: flex;
    background: ${darkTheme.background};
    border-radius: 5px;
    padding-right: 5px;
    padding-left: 5px;
`;


function PotionSearch() {

    return (
        <Container>

        </Container>
        
    )
}

export default PotionSearch