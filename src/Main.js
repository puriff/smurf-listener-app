import styled, { ThemeProvider } from "styled-components";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { darkTheme } from './theme';
import axios from "axios";
import { Box, Button, List } from "@mui/material";
import ListItem from "@mui/material/ListItem";

const Container = styled.div`
    position: relative;
    width: 98%;
    height: 95%;
    display: flex;
    margin: auto;
    background: ${darkTheme.background};
    border-radius: 5px;
    
    .columns {
        position: relative;
        margin: auto;
        min-width: 33.33%; 
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .column {
            position: relative;
            height: 95%;
            width: 98%;

            .header {
                position: relative;
                height: 10%;
                width: 100%;
                background: linear-gradient(180deg, rgba(60,73,105,1) 0%, rgba(38,52,93,1) 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid white;
                border-radius: 5px;
                border-bottom: none;
               

                .header-text {
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                }
            }

            .column-body {
                overflow: auto;
                position: relative;
                background: ${darkTheme.column_background};
                width: 100%;
                height: 90%;
                border: 1px solid white;
                border-radius: 5px;

                /* width */
                ::-webkit-scrollbar {
                width: 5px;
                }
        
                /* Track */
                ::-webkit-scrollbar-track {
                background: ${darkTheme.balance_background};
                }
        
                /* Handle */
                ::-webkit-scrollbar-thumb {
                background: #888;
                }
        
                /* Handle on hover */
                ::-webkit-scrollbar-thumb:hover {
                background: ${darkTheme.background};
                }

                .list-div {
                    width: 100%;
                    height: 100%;
                    padding-top: 0;
                    padding-bottom: 0;
                }

                .text-symbol {
                    font-size: 18px;
                }

                .item-name {
                    font-weight: bold;
                    text-decoration: underline;
                }

                .recipe-div {
                    position: relative;
                    height: 25%;
                    width: 100%;
                    border-bottom: 1px solid white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;

                    .ingredients-div {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        justify-content: center;
                        width: fit-content;
                        height: 90%;

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
                            height: 100%;
                            background: #383838;
                            border-radius: 5px;
                            border-right: 1px white solid;
                        }

                        .third-recipe {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            width: fit-content;
                            height: 100%;
                            background: grey;
                            border-radius: 5px;
                            border-right: 1px white solid;
                        }

                        .img-div {
                            aspect-ratio: 1/1;
                            height: 60%;
                            margin-left: 5px;
                        }
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
const smurfTicketAddress = "0xBaC7E3182BB6691F180Ef91f7Ae4530Abb3dc08D"
const smurfTicketContract = new ethers.Contract(smurfTicketAddress, abiPoly, providerPolygon)

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

function Main() {

    const [mintedRecipes, setMintedRecipes] = useState([])
    const [newRecipes, setNewRecipes] = useState([])
    const [newCrystalRecipe, setNewCrystalRecipes] = useState([])

    let headers = ["Latest successful recipes", "New recipes", "New crystal recipes"]
    
    useEffect(() => {
        loadLatestCrystalRecipes()
        loadLatestMintedRecipes()
        loadNewestRecipes()
        smurfMixContract.on("Mint_Recipe_Success", async(from, _recipe_id,_signature, _ingredients, event) => {   
            const url = "https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(_recipe_id).toString());
            const { data } = await axios.get(url);
            let recipeName = data.name

            let currentBlock = event.blockNumber
            let fullRecipe = await getRecipe(currentBlock, _ingredients)

            let mintedRecipe = {name: recipeName,
                                ingredients: fullRecipe
                                }
            setMintedRecipes(oldArray => [mintedRecipe,...oldArray])
        })

        smurfMixContract.on("New_Recipe_Discovered", async(_from, _recipeId, event) => {
            const url = "https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(_recipeId).toString());
            const { data } = await axios.get(url);
            let recipeName = data.name
    
            let newRecipe
            let currentBlock = event.blockNumber
            //query block at which newest recipe was discovered, for the mint success event
            let mintRecipeEvent = await smurfMixContract.queryFilter('Mint_Recipe_Success', currentBlock, currentBlock);
                //loop through list of that event that happened in the block
                for (let index = 0; index < mintRecipeEvent.length; index++) {
                //if finds an event with same recipe ID created as newest recipe
                if(Number(mintRecipeEvent[index].args._recipe_id) == Number(_recipeId))
                    {
                    //get ingredient
                    let ingredients = mintRecipeEvent[index].args._ingredients
                    newRecipe = await getRecipe(currentBlock, ingredients)
                    }
            }
    
            let latestNewRecipe = {name: recipeName,
                                    ingredients: newRecipe
                                    }
    
            setNewRecipes(oldArray => [latestNewRecipe,...oldArray])
        })

        smurfTicketContract.on("Mint_Ticket_Success", async(_from, _recipeId, event) => {
            let lastTicketMint = _recipeId
            let currentBlock = event.blockNumber
            let newRecipeEvents = await smurfMixContract.queryFilter('New_Recipe_Discovered', currentBlock-10000, currentBlock);

            for (let index = 0; index < newRecipeEvents.length; index++) {
                let newRecipeEvent = newRecipeEvents[index]
                let _recipe_Id = newRecipeEvent.args._recipe_id
                const url = "https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(_recipe_Id).toString());
                const { data } = await axios.get(url);
                let imgSrc = data.image
                let recipeName = data.name

                if(_recipe_Id = lastTicketMint) {
                    let newRecipe
                    //let currentBlock = event.blockNumber
                    //query block at which newest recipe was discovered, for the mint success event
                    let mintRecipeEvent = await smurfMixContract.queryFilter('Mint_Recipe_Success', newRecipeEvent.blockNumber, newRecipeEvent.blockNumber);
                        //loop through list of that event that happened in the block
                        for (let index = 0; index < mintRecipeEvent.length; index++) {
                            //if finds an event with same recipe ID created as newest recipe
                            if(Number(mintRecipeEvent[index].args._recipe_id) == Number(_recipe_Id))
                            {
                                //get ingredient
                                let ingredients = mintRecipeEvent[index].args._ingredients
                                newRecipe = await getRecipe(newRecipeEvent.blockNumber, ingredients)

                                let newCrystalRecipe = {name: recipeName,
                                    image: imgSrc,
                                    ingredients: newRecipe
                                    }
                        
                                setNewCrystalRecipes(oldArray => [newCrystalRecipe,...oldArray])  
                                break
                            }
                    }                
                }
            }
        })
    }, [])

    useEffect(() => {
        if(mintedRecipes.length > 10) {
            const copyArr = [...mintedRecipes];
            copyArr.pop();
            setMintedRecipes(copyArr)
        }
    }, [mintedRecipes])

    useEffect(() => {
        if(newRecipes.length > 10) {
            const copyArr = [...newRecipes];
            copyArr.pop();
            setNewRecipes(copyArr)
        }
    }, [newRecipes])

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
        let pastEvents = await smurfMixContract.queryFilter("Mint_Recipe_Success", currentBlock-10000, currentBlock);
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
            <div className="ingredients-div"> 
                <Box className="first-recipe">
                    {(potion1.length != 0) ?
                        <Box className="second-recipe">
                            {(potion2.length != 0) ?
                                <Box className="third-recipe">
                                    {potion2.map((potion2Ingredient, index) => {
                                        return  <img className="img-div" src={"https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(potion2Ingredient))+"."+(ingredientList[Number(potion2Ingredient)])+".jpg"}></img>
                                    } )} 
                                </Box> : null 
                            }
                        {potion1.map((potion1Ingredient, index) => {
                            return (potion1Ingredient != -1) ? <img className="img-div" src={"https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(potion1Ingredient))+"."+(ingredientList[Number(potion1Ingredient)])+".jpg"}></img> : null
                        })}
                    </Box> : null
                    } 
                    { ingredients.map((ingredient, index3) => {
                        return (ingredient != -1) ?  <img className="img-div" src={"https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(ingredient))+"."+(ingredientList[Number(ingredient)])+".jpg"}></img> : null
                    })}
                </Box>
            </div>
        )
    }

    async function loadLatestCrystalRecipes() {
        //replace this with event.blockNumber
        let currentBlock = await providerPolygon.getBlockNumber()
        let count = 0
        let events = await smurfTicketContract.queryFilter('Mint_Ticket_Success', currentBlock-10000, currentBlock);
        let newRecipeEvents = await smurfMixContract.queryFilter('New_Recipe_Discovered', currentBlock-10000, currentBlock);

        for (let index = 0; index < events.length; index++) {
            if(count >= 5) {break}

            let lastTicketMint = Number(events[index].args._recipeId)

            for (let index = 0; index < newRecipeEvents.length; index++) {
                let newRecipeEvent = newRecipeEvents[index]
                let _recipeId = newRecipeEvent.args._recipe_id
                const url = "https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(_recipeId).toString());
                const { data } = await axios.get(url);
                let imgSrc = data.image
                let recipeName = data.name

                if(_recipeId = lastTicketMint) {
                    let newRecipe
                    //let currentBlock = event.blockNumber
                    //query block at which newest recipe was discovered, for the mint success event
                    let mintRecipeEvent = await smurfMixContract.queryFilter('Mint_Recipe_Success', newRecipeEvent.blockNumber, newRecipeEvent.blockNumber);
                    //loop through list of that event that happened in the block
                        for (let index = 0; index < mintRecipeEvent.length; index++) {
                            //if finds an event with same recipe ID created as newest recipe
                            if(Number(mintRecipeEvent[index].args._recipe_id) == Number(_recipeId))
                            {
                                //get ingredient
                                let ingredients = mintRecipeEvent[index].args._ingredients
                                newRecipe = await getRecipe(newRecipeEvent.blockNumber, ingredients)

                                let newCrystalRecipe = {name: recipeName,
                                    image: imgSrc,
                                    ingredients: newRecipe
                                    }
                        
                                setNewCrystalRecipes(oldArray => [newCrystalRecipe,...oldArray])                                 
                            }
                    }                
                }
            }
            count++
        }
    }

    async function loadLatestMintedRecipes() {
        let currentBlock = await providerPolygon.getBlockNumber()
        let mintRecipeEvent = await smurfMixContract.queryFilter('Mint_Recipe_Success', currentBlock-1000,currentBlock);

        let count = 0
        for (let index = 0; index < mintRecipeEvent.length; index++) {
            if(count >= 5) {break}
            const url = "https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(mintRecipeEvent[index].args._recipe_id).toString());
            const { data } = await axios.get(url);
            let imgSrc = data.image
            let recipeName = data.name
            let ingredients = mintRecipeEvent[index].args._ingredients
            let newRecipe = await getRecipe(mintRecipeEvent[index].blockNumber, ingredients)

            let newCrystalRecipe = {name: recipeName,
                image: imgSrc,
                ingredients: newRecipe
                }
    
            setMintedRecipes(oldArray => [newCrystalRecipe,...oldArray])   
            count++                              
        }                      
    }

    async function loadNewestRecipes() {
        let currentBlock = await providerPolygon.getBlockNumber()
        let newRecipeEvents = await smurfMixContract.queryFilter('New_Recipe_Discovered', currentBlock-10000, currentBlock)

        let count = 0;
        for (let index = 0; index < newRecipeEvents.length; index++) {
            if(count >= 5) {break}
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
    
            setNewRecipes(oldArray => [latestNewRecipe,...oldArray])    
            count++            
        }
    }

        return (
        <Container>
            <div className="columns">
                    <div className="column">
                        <div className="header">
                            <div className="header-text">
                                {headers[0]}
                            </div>
                        </div>
                        <div className="column-body">
                            <List className='list-div'>
                                {mintedRecipes.map((item, index) => (   
                                        <ListItem className="recipe-div" key={index}> 
                                            <span className="item-name">{item.name}</span>
                                            <div className="ingredients-div"> 
                                                   {parseImages(item)}
                                            </div>
                                        </ListItem>
                                ))}
                            </List>
                        </div>
                    </div>
                </div>
            <div className="columns">
                <div className="column">
                    <div className="header">
                        <div className="header-text">
                            {headers[1]}
                        </div>
                    </div>
                    <div className="column-body">
                        <List className='list-div'>
                            {newRecipes.map((item, index) => (   
                                    <ListItem className="recipe-div" key={index}> 
                                        <span className="item-name">{item.name}</span>
                                        <div className="ingredients-div"> 
                                                {parseImages(item)}
                                        </div>
                                    </ListItem>
                            ))}
                        </List>
                    </div>
                </div>
            </div>
            <div className="columns">
                <div className="column">
                    <div className="header">
                        <div className="header-text">
                            {headers[2]}
                        </div>
                    </div>
                    <div className="column-body">
                        <List className="list-div">
                            {newCrystalRecipe.map((item, index) => ( 
                                    <ListItem className="recipe-div" key={index}>
                                        <span className="item-name">{item.name}</span>
                                        <div className="ingredients-div"> 
                                                {parseImages(item)}
                                        </div>
                                    </ListItem>   
                            ))}
                        </List>  
                    </div>
                </div>
                </div>
        </Container>
        
    )
}

export default Main