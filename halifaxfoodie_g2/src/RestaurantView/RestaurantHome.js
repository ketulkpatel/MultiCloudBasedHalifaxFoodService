/**
 * @author Ketul Patel - B00900957.
 * @project Serverless- Project - G2.
 */

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
// Function to show the page of restaurant home.
export default function RestaurantHome() {

  // Required states for the page.
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  // To navigate to different URL.
  const navigate = useNavigate();

  useEffect(() => {

    let emailID = localStorage.getItem("email");
    if (emailID == "" || emailID == null) {
      navigate('/login-1');
    }

  }, []);


  // Navigate to visulization.
  const navigateVisulization = () => {
    navigate('/visulization-graphs');
  };

  // Navigate to customer feedbacks.
  const navigateListOfCustomerFeedback = () => {
    navigate('/list-of-customer-feedbacks');

  };

  // Navigate to upload recipe.
  const navigateUploadRecipe = () => {
    navigate('/upload-file');
  };

   // Navigate to upload recipe.
   const navigateExtractRecipe = () => {
    navigate('/extract-recipe');
  };
 
  // Return the view for the page.
  return (
    <div className="form">
      <div>
        <h1>Halifax Foodie - G2 - RestaurantHome</h1>
      </div>

      <form>
        <button onClick={navigateVisulization} className="btn" type="submit">
          Visulization graphs
        </button>
        <button onClick={navigateListOfCustomerFeedback} className="btn" type="submit">
          Customer feedbacks
        </button>
        <button onClick={navigateUploadRecipe} className="btn" type="submit">
          Upload recipe
        </button>
        <button onClick={navigateExtractRecipe} className="btn" type="submit">
          Extract Recipe
        </button>
      </form>

    </div>
  );
}