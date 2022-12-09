import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
// Function to get the visulization graph for logged-in restaurant.
export default function DataVisualization() {

  // To navigate.
  const navigate = useNavigate();

  useEffect(() => {

    let resaurantID = localStorage.getItem("email");
    resaurantID = "ketul@gmail.com"
    if(resaurantID == ""  || resaurantID == null){
      navigate('/login-1');
    }
    else{

    // Trigger URL for the lambda function to store graph data in spreadsheet.
    let url = "https://p55u5ugyr76z3fnnr3kd76e4km0kqlpf.lambda-url.us-east-1.on.aws/";

    // Method POST with body data in the JSON format.
    let options = {
      method: "POST",
      body: JSON.stringify({
        RestaurantID: resaurantID
      }),
    };

    // Sending the request to store the visualization data to the spreadsheet using lambda function.
    // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.  
    const getVisulizationGraphs = async () => {
      await fetch(url, options)
        .then( (response) => {
          if (response.ok == false) {
            alert("SOMETHING WENT WRONG.")
          }
        })
    }
    getVisulizationGraphs();
  }
    

  });

  // Return the view for the page.
  return (
    <div>
      <h2>Login visualization</h2>

<iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/b5e4d0e0-b20b-412e-bd85-e05eaf8ce8b1/page/Pj88C"></iframe><br></br>

<h2>Recipe visualization</h2>
<iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/608da799-72ff-4090-9109-2b6788a44109/page/DNZ9C"></iframe>
</div>  );
}