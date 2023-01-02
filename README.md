# React app for the smurf listener

Listens to latest minted recipes, newest recipes and new crystal minting
Same logic, with recursive event calls to get list of ingredients of underlying potions if there's any

All known recipes in PotionSearch.js are obtained through the contract directly :
  - Query __discoveredRecipes with an incremented id, until it returns an error
  - Erros means end of array has been reached => latest recipe discovered
  - Then just query https://app.thesmurfssociety.com/metadata/public/metadata/cauldron/"+(Number(discoveredRecipe).toString()) at each iteration to get the potion name etc

Need to allow CORS for it to work, can use this https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf?hl=en

