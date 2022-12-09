import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
// Function to get the recipe details.
export default function ResturantRecipeDetails() {

  // Required states for the page.
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState('');
  const [recipePrice, setRecipePrice] = useState('');
  const [recipeRating, setRecipeRating] = useState('');
  const [recipeType, setRecipeType] = useState('');
  const [similarRecipes, setSimilarRecipes] = useState([]);

  // To navigate to different URL.
  const navigate = useNavigate();

  useEffect(() => {

    // Fetch RecipeID from local storage.
    let recipeid = localStorage.getItem("RecipeID");

    // Check if recipeID is empty or not.
    if (recipeid == "" || recipeid == null) {
      navigate('/customer-home');
    }
    else {

      // set the current recipe details from local storage.
      setRecipeName(localStorage.getItem("RecipeName"))
      setRecipePrice(localStorage.getItem("RecipePrice"))
      setRecipeRating(localStorage.getItem("RecipeRating"))
      setRecipeType(localStorage.getItem("RecipeType"))
      setRecipeIngredients(localStorage.getItem("RecipeIngredients"))

      // Function to get similar recipes for the recipe.
      const getSimilarRecipes = async () => {

        // Trigger URL for the cloud function to get confidence score for the recipe.
        let url = "https://us-central1-csci5410g2.cloudfunctions.net/PredictRecipe";

        // Method POST and pass data to body in JSON format.
        let options = {
          method: "POST",
          body: JSON.stringify({
            text: localStorage.getItem("RecipeIngredients")
          }),
        };

        // Sending the request to get the confidence score from the cloud function.
        // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.  
        await fetch(url, options)
          .then((response) => response.json()).then(async (res) => {

            let vegConfidence = res[0].confidences;
            let id = localStorage.getItem("id");
            let nonVegConfidence = res[1].confidences;

            // Trigger URL for the lambda function to get similar recipes from dynamodb.
            let url_2 = "https://nxse72ftgzk2grf3unh4yog3ju0lrywb.lambda-url.us-east-1.on.aws/";

            // Method POST and data in body as JSON format.
            let option_2 = {
              method: "POST",
              body: JSON.stringify({
                veg_confidence: vegConfidence,
                nonveg_Confidence: nonVegConfidence,
                RestaurantID: id,
                RecipeID: localStorage.getItem("RecipeID")
              }),
            }

            // Sending the request to get similar recipes from dynamodb.
            // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.  
            await fetch(url_2, option_2)
              .then((response) => response.json()).then((res) => {
                let items = res.body.data.Items
                let data = []

                for (let item in items) {
                  let recipe_id = items[item].RecipeID;
                  if (parseInt(localStorage.getItem("RecipeID")) != recipe_id) {
                    data.push(items[item]);
                  }

                  setSimilarRecipes(data);

                }
              })
              .catch((error) => {

              })


          })
          .catch((error) => {
            debugger
            setError(true);
            setErrorMessage("Something went wrong. Try again.");
          })
      }

      getSimilarRecipes();

    }
  }, []);

  // Showing error message if error is true
  const showError = () => {
    return (
      <div
        className="error"
        style={{
          display: error ? '' : 'none',
        }}>
        <h1>{errorMessage}</h1>
      </div>
    );
  };


  // Return view for the page.
  return (
    <div className="form">
      <div>
        <h1>Selected recipe details and its similar recipes.</h1>
      </div>
      <div className="messages">
        {showError()}
      </div>
      <label><b>Recipe name:</b></label> {recipeName} <br></br>
      <label><b>Recipe price:</b></label> {recipePrice}$<br></br>
      <label><b>Recipe actual type:</b></label> {recipeType}<br></br>
      <label><b>Recipe rating:</b></label> {recipeRating}/5<br></br>
      <label><b>Recipe ingredients:</b></label> {recipeIngredients}<br></br>
      <h2>Similar Recipes found based on confidence score: </h2>

      <table>
        <tr>
          <td>RecipeName</td>
          <td>RecipePrice</td>
          <td>RecipeType</td>
          <td>RecipeRating(Out of 5)</td>
        </tr>
        {similarRecipes.map((similarRecipe) => {
          {
            return (<tr>
              <td>{similarRecipe.RecipeName}</td>
              <td>{similarRecipe.RecipePrice}$</td>
              <td>{similarRecipe.RecipeType}</td>
              <td>{similarRecipe.RecipeRating}/5</td>
            </tr>)
          }
        })}

      </table>

    </div>
  );
}