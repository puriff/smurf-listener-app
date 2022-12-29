import styled from "styled-components";
import { ethers } from "ethers";
import { darkTheme } from './theme';
import axios from "axios";
import { Box, Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";

const Container = styled.div`
    position: relative;
    width: 98%;
    height: 90%;
    background: ${darkTheme.background};
    margin: auto;

    .search-div {
        position: relative;
        width: 50%;
        height: fit-content;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: auto;

        .search-bar {
            margin-top: 2%;
            width: 100%;

            .MuiInputBase-root {
                color: white;
                
                :after {
                    border-color: white;
                }
        }
    }
    }

    .list-div {
        position: relative;
        height: 90%;
        width: 100%;  
        
        .ingredients-div {
            position: relative;
            width: 100%;
            height: 20%;
            display: flex;
            align-items: center;
            
            .recipe-name {
                display: flex;
                position: relative;
                width: 30%;
                font-size: 18px;
                height: 100%;
                align-items: center;
                padding-left: 10px;
                font-weight: bold;
                border-radius: 30px 0 0 30px;
                outline: 1px solid white;
                background: linear-gradient(180deg, rgba(60,73,105,1) 0%, rgba(38,52,93,1) 100%);
            }

            .recipe-div {
                position: relative;
                width: 70%;
                height: 100%;
                border-top: 1px solid white;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;

                .first-recipe {  
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    width: fit-content;
                    height: 100%;
                    border-radius: 5px;
                    padding-right: 3px;
                }

                .second-recipe {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    width: fit-content;
                    height: 90%;
                    background: #383838;
                    border-radius: 5px;
                    border-right: 2px white solid;
                }

                .third-recipe {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    width: fit-content;
                    height: 90%;
                    background: grey;
                    border-radius: 5px;
                    margin-left: 5px;
                    border-right: 2px white solid;
                }

                .img-div {
                    aspect-ratio: 1/1;
                    height: 90%;
                    margin-left: 5px;
                    outline: 1px solid white;
                    border-radius: 50%;
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
    "function __discoveredRecipes(uint256 id) external view returns (uint256 recipe)"
]

const smurfMixAddress = "0x48c75FbF0452fA8FF2928Ddf46B0fE7629cCa2FF"
const smurfMixContract = new ethers.Contract(smurfMixAddress, abiMix, providerPolygon)

const ingredientList = [
    "Blue_Clay",
    "Rain_Drops",
    "Daisies",
    "Sarsaparilla",
    "Tuberose_Flowers",
    "Forest_Mushrooms",
    "Cork_Bark",
    "Butterfly_Chrysalis",
    "Hedgehog_Spines",
    "Squirrel_s_Loot",
    "Sticky_Honey",
    "Juicy_Grubs",
    "Loona_Dust",
    "Howlibird_s_Egg",
    "Rainbow_Broth",
    "Horn_of_an_Angry_Bull",
    "Swaddling_Cloth",
    "Shooting_Star_Powder",
    "Strange_Cube",
    "Carnivorous_Plant_Saliva",
    "Love_Potion",
    "Red_Beans"
  ]

function PotionSearch() {

    const [recipes, setRecipes] = useState([])
    const [count, setCount] = useState(0)
    const [searchElement, setSearchElement] = useState([])

    async function findKnownRecipesWithElements() {
        /*let currentBlock = await providerPolygon.getBlockNumber()
        let newRecipeEvents = await smurfMixContract.queryFilter('New_Recipe_Discovered', 0, currentBlock)

        for (let index = 0; index < newRecipeEvents.length; index++) {
            /*let _recipeId = newRecipeEvents[index].args._recipe_id
            const url = "https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(_recipeId).toString());
            const { data } = await axios.get(url);
            let recipeName = data.name
    
            let newRecipe
            let eventBlock = newRecipeEvents[index].blockNumber
            let mintRecipeEvent = await smurfMixContract.queryFilter('Mint_Recipe_Success', eventBlock, eventBlock);
            for (let index = 0; index < mintRecipeEvent.length; index++) {
                if(Number(mintRecipeEvent[index].args._recipe_id) == Number(_recipeId))
                {
                    let ingredients = mintRecipeEvent[index].args._ingredients
                    //newRecipe = await getRecipe(eventBlock, ingredients)
                }
            }
            let latestNewRecipe = {name: recipeName,
                                    ingredients: newRecipe
                                    }
    
            setRecipes(oldArray => [latestNewRecipe,...oldArray])    
        }*/
    }

    async function getDiscoveredRecipe() {
        let id = 0
        do {
            let discoveredRecipe = await smurfMixContract.__discoveredRecipes(id);
            const url = "https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(discoveredRecipe).toString());
            const { data } = await axios.get(url);
            let recipeName = data.name
            id++
            setCount((count) => count + 1);
            let latestNewRecipe = {name: recipeName,
                                    id: Number(discoveredRecipe)
                                    }
            setRecipes(oldArray => [latestNewRecipe,...oldArray])
        } while (true);        
    }

    useEffect(() => {
        getDiscoveredRecipe()
    }, [])

    //create a search bar, where you give an element (or a full recipe)
    //query to find any recipe with said element(s)
    //THEN query to find all failed recipes with said element(s)
    return (
        <Container>
            <div className="search-div">
                <TextField className="search-bar" variant="outlined" label="Enter address"
                            color="warning"
                            focused
                            value= {searchElement}
                            onChange= {(e) => setSearchElement(e.target.value)}
                            InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton color="warning"
                                        onClick={() => console.log(searchElement)}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                            }}
                ></TextField>
            </div>
            <Button onClick={() => findKnownRecipesWithElements()}>GET RECIPE</Button>
            <div>Number of potions : {count}</div>
            <div className="list-div">
                {recipes.map((recipe) => 
                    <div className="ingredients-div"> <p className="recipe-name">{recipe.name}</p> </div>
                )}
            </div>

        </Container>
        
    )
}

export default PotionSearch