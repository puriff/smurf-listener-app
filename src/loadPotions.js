import styled from "styled-components";
import { ethers } from "ethers";
import { darkTheme } from './theme';
import axios from "axios";
import { Box, Button } from "@mui/material";
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
    
            }
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

    async function loadRecipes() {
        let currentBlock = await providerPolygon.getBlockNumber()
        let newRecipeEvents = await smurfMixContract.queryFilter('New_Recipe_Discovered', 0, currentBlock)
        let countTMP = 0
        for (let index = 0; index < newRecipeEvents.length; index++) {
            let _recipeId = newRecipeEvents[index].args._recipe_id
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
                    newRecipe = await getRecipe(eventBlock, ingredients)
                }
            }
            let latestNewRecipe = {name: recipeName,
                                    ingredients: newRecipe
                                    }
    
            setRecipes(oldArray => [latestNewRecipe,...oldArray])   
            setCount((count) => count + 1);
        }
    }

    async function getRecipe(blockNumber, ingredients) {    
        let ingredientsTMP = []  
        for (let index = 0; index < ingredients.length; index++) {
            //check if there's a potion in the recipe
            if(Number(ingredients[index]) > 99) {
                let ingredientsFull = await getPotionIngredients(blockNumber, Number(ingredients[index]))
                let ingredientsPotion2 = []
                for (let index2 = 0; index2 < ingredientsFull.length; index2++) {
                    if(ingredientsFull[index2].length > 1) {
                        ingredientsPotion2[index2] = [Number(ingredientsFull[index2][0]),Number(ingredientsFull[index2][1]),Number(ingredientsFull[index2][2])]
                    }
                    else {
                        ingredientsPotion2[index2] = Number(ingredientsFull[index2])
                    }
                }
                ingredientsTMP[index] = ingredientsPotion2
            }
            else {
                ingredientsTMP[index] = Number(ingredients[index])
            }
        }
        return ingredientsTMP
      }
      
    
      //there is a potion in latest recipe list, so need to get ingredient of that potion aswell
    async function getPotionIngredients(currentBlock, lastRecipeFound) {
        //query pas blocks, to find tx where recipe id = recipe we need to find list of ingredients for
        let pastEvents = await smurfMixContract.queryFilter("Mint_Recipe_Success", currentBlock-50000, currentBlock);
        //loop through events
        for (let index = 0; index < pastEvents.length; index++) {
            //check if recipe minted id = recipe we're looking for
            if(Number(pastEvents[index].args._recipe_id) == lastRecipeFound) {
                //get ingredients from potion
                let ingredients = pastEvents[index].args._ingredients
                let ingredientsTMP = []  
                //check if there's a potion in those ingredients
                for (let index = 0; index < ingredients.length; index++) {
                    //if yes, we start agane
                    if(Number(ingredients[index]) > 99 ) {
                        let ingredientsFull = await getPotionIngredients(currentBlock, Number(ingredients[index]))
                        ingredientsTMP[index] = [Number(ingredientsFull[0]),Number(ingredientsFull[1]),Number(ingredientsFull[2])]
                    }
                    else {
                        ingredientsTMP[index] = Number(ingredients[index])
                    }
                }
                return ingredientsTMP
            }
        }
    }

    function parseImages(item) {
        let ingredients = [...item.ingredients];
        let potion1 = [];
        let potion2 = [];

        for (let index = 0; index < ingredients.length; index++) {
            if(ingredients[index].length > 1) {
                potion1 = [...ingredients[index]]
                ingredients[index] = -1
                for (let indexPotion1 = 0; indexPotion1 < potion1.length; indexPotion1++) {
                    if(potion1[indexPotion1].length > 1) {
                        potion2 = [...potion1[indexPotion1]]
                        potion1[indexPotion1] = -1;
                        break;
                    }  
                }
            }            
        }
        return (
                <Box className="first-recipe">
                    {(potion1.length != 0) ?
                        <Box className="second-recipe">
                            {(potion2.length != 0) ?
                                <Box className="third-recipe">
                                    {potion2.map((potion2Ingredient, index) => {
                                        return  <img className="img-div" src={"https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(potion2Ingredient))+"."+(ingredientList[Number(potion2Ingredient)])+".jpg"}></img>
                                    } )}  =>
                                </Box>  : null 
                            }
                        {potion1.map((potion1Ingredient, index) => {
                            return (potion1Ingredient != -1) ? <img className="img-div" src={"https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(potion1Ingredient))+"."+(ingredientList[Number(potion1Ingredient)])+".jpg"}></img> : null
                        })} =>
                    </Box> : null
                    }
                    { ingredients.map((ingredient, index3) => {
                        return (ingredient != -1) ?  <img className="img-div" src={"https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(ingredient))+"."+(ingredientList[Number(ingredient)])+".jpg"}></img> : null
                    })}
                </Box>
        )
    }

    useEffect(() => {
        //loadRecipes()
    }, [])

    return (
        <Container>
            <div className="content-panel">
                <Button className="load-button" onClick={()=>loadRecipes()}>LOAD ALL RECIPES</Button>
                <div>Number of potions : {count}</div>
                <div className="list-div">
                    {recipes.map((recipe) => 
                        <div className="ingredients-div"> <p className="recipe-name">{recipe.name}</p> <div className="recipe-div">{parseImages(recipe)}</div></div>
                    )}
                </div>
            </div>
        </Container>
        
    )
}

export default PotionSearch