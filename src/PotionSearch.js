import styled from "styled-components";
import { ethers } from "ethers";
import { darkTheme } from './theme';
import axios from "axios";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";


const Container = styled.div`
    position: relative;
    width: 98%;
    height: 90%;
    background: ${darkTheme.background};
    display: flex;
    align-items: center;
    justify-content: center; 
    margin: auto;

    .content-panel {
        position: relative;
        width: 100%;
        height: 100%;
        
        .load-button {
            position: relative;
            height: 10%;
            background: white;
    
            :hover {
                background: transparent;
                color: white;
                border: 1px white solid;
            }
        }
    
        .list-div {
            position: relative;
            height: 90%;
            width: 100%;   
        }
    }
`;

const providerPolygon = new ethers.providers.StaticJsonRpcProvider(
    "https://polygon-rpc.com/", 
    {
      chainId: 137,
      name: "Polygon",
    }
  );

const abiPoly = [
    "event Mint_Ticket_Success(address indexed _from, uint _recipeId)",
]
const abiMix = [
    "event Mint_Recipe_Success(address indexed _from, uint _recipe_id, bytes _signature, uint[] _ingredients)",
    "event Mint_Recipe_Failed(address indexed _from, uint[] _ingredients)",
    "event New_Recipe_Discovered(address indexed _from, uint _recipe_id)",
]

const smurfMixAddress = "0x48c75FbF0452fA8FF2928Ddf46B0fE7629cCa2FF"
const smurfMixContract = new ethers.Contract(smurfMixAddress, abiMix, providerPolygon)

function PotionSearch() {

    const [recipes, setRecipes] = useState([])
    const [count, setCount] = useState(0)

    async function loadRecipes() {
        let currentBlock = await providerPolygon.getBlockNumber()
        let newRecipeEvents = await smurfMixContract.queryFilter('New_Recipe_Discovered', 0, currentBlock)
        for (let index = 0; index < newRecipeEvents.length; index++) {
            let _recipeId = newRecipeEvents[index].args._recipe_id
            const url = "https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(_recipeId).toString());
            const { data } = await axios.get(url);
            let recipeName = data.name

            let latestNewRecipe = {name: recipeName}
    
            setRecipes(oldArray => [latestNewRecipe,...oldArray])   
            setCount((count) => count + 1);
        }
    }

    useEffect(() => {
        loadRecipes()
    }, [])

    return (
        <Container>
            <div className="content-panel">
                <Button className="load-button" onClick={()=>loadRecipes()}>LOAD ALL RECIPES</Button>
                <div>Number of potions : {count}</div>
                <div className="list-div">
                    {recipes.map((recipe) => 
                        <p>{recipe.name}</p>
                    )}
                </div>
            </div>
        </Container>
        
    )
}

export default PotionSearch