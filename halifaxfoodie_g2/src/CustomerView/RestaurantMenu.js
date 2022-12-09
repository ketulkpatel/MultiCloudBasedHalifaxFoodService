import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react';
// Function to display the restaurant menu for selected restaurant.
export default function RestaurantMenu() {

  // Required states for the page.
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [recipes, setRecipes] = useState([]);

  // To navigate to different URL.
  const navigate = useNavigate();

  // ID from params to get from the URL.
  const { id } = useParams();

  useEffect(() => {

    // Check if id is null/empty.
    if (id == "" || id == null) {
      navigate('/login-1');
    }
    else {

      // Decyprt the ID from URL and store in local storage.
      var decryptedID = atob(id);
      localStorage.setItem("id", id);

      // Trigger URL for the lambda function to fetch recipes for restaurants from dynambodb database.
      let url = "https://lddfrv2fmarz672v7457xq2cfq0edqog.lambda-url.us-east-1.on.aws/";

      // Method POST and pass data to body in JSON format.
      let options = {
        method: "POST",
        body: JSON.stringify({
          RestaurantID: decryptedID
        }),
      };

      // Sending the request to fetch recipes for selected restaurant from the dynambo database using lambda function.
      // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.
      const getRecipes = async () => {
        await fetch(url, options)
          .then((response) => response.json()).then((res) => {
            let items = res.body.data.Items
            setRecipes(items);

          })
          .catch((error) => {

            setError(true);
            setErrorMessage("Something went wrong. Try again.");
          })
      }

      getRecipes();
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

  // Hanlde onClick event on view more details for recipe.
  const handleOnClick = async (recipeid) => {

    // Trigger URL for the lambda function to fetch recipe information from dynambodb database.
    let url = "https://dhgssw5kx2kledni7bfze7d7u40kxjop.lambda-url.us-east-1.on.aws/";

    // Method POST and pass data in JSON format.
    let options = {
      method: "POST",
      body: JSON.stringify({
        RecipeID: recipeid
      }),
    };

    // Sending the request to fetch recipe information selected recipe from the dynambo database using lambda function.
    // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.
    const getRecipeDetails = async () => {
      await fetch(url, options)
        .then((response) => response.json()).then((res) => {
          let data = res.body.data.Items[0];
          localStorage.setItem("RecipeName", data.RecipeName);
          localStorage.setItem("RecipeID", data.RecipeID);
          localStorage.setItem("RecipeIngredients", data.RecipeIngredients);
          localStorage.setItem("RecipePrice", data.RecipePrice);
          localStorage.setItem("RecipeRating", data.RecipeRating);
          localStorage.setItem("RecipeType", data.RecipeType);

          navigate('/recipe-details');
        })
        .catch((error) => {
          setError(true);
          setErrorMessage("Something went wrong. Try again.");
        })
    }
    getRecipeDetails();
  }

  // Return the view for the page.
  return (
    <div className="form">
      <div>
        <h1>List of recipes for selected restaurnant</h1>
      </div>
      <div className="messages">
        {showError()}
      </div>
      <table>
        <tr>
          <td>RecipeName</td>
          <td>RecipePrice</td>
          <td>RecipeType</td>
          <td>RecipeRating(Out of 5)</td>
          <td>More Details</td>
        </tr>
        {recipes.map((recipe) => {
          {
            return (

              <tr>

                <td>{recipe.RecipeName}</td>
                <td>{recipe.RecipePrice}$</td>
                <td>{recipe.RecipeType}</td>
                <td>{recipe.RecipeRating}/5</td>
                <td> <button onClick={() => { handleOnClick(recipe.RecipeID) }} type="submit">Click here to get recipe details </button></td>

              </tr>)
          }
        })}

      </table>


    </div>
  );
}