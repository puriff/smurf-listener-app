import styled, { ThemeProvider } from "styled-components";
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import { darkTheme } from './theme';
import axios from "axios";
import { Box, Button, List } from "@mui/material";
import ListItem from "@mui/material/ListItem";

const Container = styled.div`
    position: relative;
    width: 95%;
    height: 95%;
    display: flex;
    background: ${darkTheme.content_div};
    border-radius: 15px;
    padding-right: 10px;
    padding-left: 10px;
    
    .columns {
        position: absolute;
        margin: auto;
        left: 0;
        width: 100%; 
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        .column {
            position: relative;
            height: 95%;
            width: 95%;

            .header {
                position: relative;
                height: 10%;
                width: 100%;
                background: linear-gradient(180deg, rgba(60,73,105,1) 0%, rgba(38,52,93,1) 100%);
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid white;

                .header-text {
                    color: white;
                    font-weight: bold;
                    font-size: 16px;
                }
            }

            .column-body {
                overflow: hidden;
                position: relative;
                background: ${darkTheme.column_background};
                width: 100%;
                height: 90%;
                border: 1px solid white;

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
                            background: ${darkTheme.background};
                            border-radius: 5px;
                            padding-right: 5px;
                        }

                        .second-recipe {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            width: fit-content;
                            height: 100%;
                            background: ${darkTheme.content_div};
                            border-radius: 5px;
                        }

                        .third-recipe {
                            display: flex;
                            flex-direction: row;
                            align-items: center;
                            justify-content: center;
                            width: fit-content;
                            height: 100%;
                            background: #383838;
                            border-radius: 5px;
                        }


                        .img-div {
                            aspect-ratio: 1/1;
                            height: 80%;
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

function Main() {
    let testRecipe ={ name: "test",
                        image: "https://metadata.thesmurfssociety.com/potions/nft/Potion_7.jpg",
                        level: 7,
                        ingredients: [["https://metadata.thesmurfssociety.com/ingredients/nft/18.Strange_Cube.jpg", "https://metadata.thesmurfssociety.com/ingredients/nft/10.Sticky_Honey.jpg", ["https://metadata.thesmurfssociety.com/ingredients/nft/17.Shooting_Star_Powder.jpg","https://metadata.thesmurfssociety.com/ingredients/nft/19.Carnivorous_Plant_Saliva.jpg","https://metadata.thesmurfssociety.com/ingredients/nft/20.Love_Potion.jpg"]],
                        "https://metadata.thesmurfssociety.com/ingredients/nft/4.Tuberose_Flowers.jpg",
                        "https://metadata.thesmurfssociety.com/ingredients/nft/10.Sticky_Honey.jpg"]
                    }
    //add other stuff
    let testID = {  name: "test",
                    level: 7,
                    image: "https://metadata.thesmurfssociety.com/potions/nft/Potion_7.jpg",
                    ingredients: [[2, [18, 6, 9], 15], 12, 7]
    }
    const [mintedRecipes, setMintedRecipes] = useState([testID])
    const [failedRecipes, setFailedRecipes] = useState([])

    let headers = ["Latest successful recipes", "New recipes", "New crystal recipes"]

    
    
    useEffect(() => {
        smurfMixContract.on("Mint_Recipe_Success", async(from, _recipe_id,_signature, _ingredients, event) => {   
            const url = "https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(_recipe_id).toString());
            const { data } = await axios.get(url);
            let recipeName = data.name
            let imgSrc = data.image
            let attributes = data.attributes
            let level
            attributes.map((item) => {
                if(item.trait_type == "Level")
                {
                    level = item.value
                }
            })

            /*let ingredientsIMG = []
            for (let index = 0; index < _ingredients.length; index++) {
                let img
               if(Number(_ingredients[index]) > 99) {
                    img = "https://metadata.thesmurfssociety.com/potions/nft/Potion_3.jpg"
               }
               else {
                    img = "https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(_ingredients[index]))+"."+(ingredientList[Number(_ingredients[index])])+".jpg"
               }
               ingredientsIMG[index] = img
            }*/

            let currentBlock = event.blockNumber
            let fullRecipe = await getRecipe(currentBlock, _ingredients, "Minted recipe")
            //let recipeImages = await getImages(fullRecipe)          
            //console.log(fullRecipe)
            let mintedRecipe = {name: recipeName,
                                image: imgSrc,
                                level: level,
                                ingredients: fullRecipe
                                }
            setMintedRecipes(oldArray => [mintedRecipe,...oldArray])
        })
    
        smurfMixContract.on("Mint_Recipe_Failed", async(from, _ingredients, event) => {            
            let mintedRecipe = Number(_ingredients[0]) + " , " + Number(_ingredients[1]) + " , " + Number(_ingredients[2])
            setFailedRecipes(oldArray => [mintedRecipe,...oldArray])
        })
    }, [])

    useEffect(() => {
        if(failedRecipes.length > 10) {
            const copyArr = [...failedRecipes];
            copyArr.pop();
            setFailedRecipes(copyArr)
        }
    }, [failedRecipes])

    useEffect(() => {
        if(mintedRecipes.length > 10) {
            const copyArr = [...mintedRecipes];
            copyArr.pop();
            setMintedRecipes(copyArr)
        }
    }, [mintedRecipes])

    async function getRecipe(blockNumber, ingredients, message) {    
        let ingredientsTMP = []  
        for (let index = 0; index < ingredients.length; index++) {
            //check if there's a potion in the recipe
            if(Number(ingredients[index]) > 99) {
                console.log(Number(ingredients[index]) +" is a Potion 1")
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
                console.log(pastEvents[index])
                //get ingredients from potion
                let ingredients = pastEvents[index].args._ingredients
                let ingredientsTMP = []  
                //check if there's a potion in those ingredients
                for (let index = 0; index < ingredients.length; index++) {
                    //if yes, we start agane
                    if(Number(ingredients[index]) > 99 ) {
                        console.log(Number(ingredients[index]) + " is a potion 2")
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
                    <Box className="second-recipe">
                        <Box className="third-recipe">
                            {(potion2.length != 0) ? potion2.map((potion2Ingredient, index) => {
                                return  <img className="img-div" src={"https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(potion2Ingredient))+"."+(ingredientList[Number(potion2Ingredient)])+".jpg"}></img>
                            } ): null } 
                            {(potion2.length != 0) ? <p className="text-symbol">=></p> : null} 
                        </Box>
                        { (potion1 != []) ? potion1.map((potion1Ingredient, index) => {
                            return (potion1Ingredient != -1) ? <img className="img-div" src={"https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(potion1Ingredient))+"."+(ingredientList[Number(potion1Ingredient)])+".jpg"}></img> : null
                        }) : null }
                        
                        {((potion1.length != 0)) ? <p className="text-symbol">=></p> : null}
                    </Box>
                    { ingredients.map((ingredient, index3) => {
                        return (ingredient != -1) ?  <img className="img-div" src={"https://metadata.thesmurfssociety.com/ingredients/nft/"+(Number(ingredient))+"."+(ingredientList[Number(ingredient)])+".jpg"}></img> : null
                    })}
                </Box>
            </div>
        )
    }

    return (
        <Container>
            {/*<div className="columns">
                    <div className="column">
                        <div className="header">
                            <div className="header-text">
                                {headers[0]}
                            </div>
                        </div>
                        <div className="column-body">
                            <List className="list-div">
                                {failedRecipes.map((item, index) => ( 
                                        <ListItem className="recipe-div" key={index}>
                                            {item}
                                        </ListItem>   
                                ))}  
                            </List>  
                        </div>
                    </div>
                </div>*/}

                <div className="columns">
                    <div className="column">
                        <div className="header">
                            <div className="header-text">
                                {headers[1]}
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
        </Container>
        
    )
}

export default Main