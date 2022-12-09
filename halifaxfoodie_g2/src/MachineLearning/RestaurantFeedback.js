import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import React from 'react';
// Function to get the customer feedback for logged-in restaurant.
export default function RestaurantFeedback() {

  // States required for the page.
  const [resaurantID, setResaurantID] = useState('');

  // To navigate to different URL.
  const navigate = useNavigate();

  useEffect(() => {

    let resaurantID = "ketul@gmail.com";

    // Trigger URL for the lambda function to store feedback data in spreadsheet.
    let url = "https://zeqbq3gyaqv2g27x3miz3l4yru0qvwvs.lambda-url.us-east-1.on.aws/";

    // Method POST with body data in the JSON format.
    let options = {
      method: "POST",
      body: JSON.stringify({
        RestaurantID: resaurantID
      }),
    };

    // Sending the request to store the feedback data to the spreadsheet using lambda function.
    // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.  
    const getCustomerFeedbacks = async () => {
      await fetch(url, options)
        .then((response) => {

          if (response.ok == false) {
            alert("SOMETHING WENT WRONG.")
          }

        })
    }

    getCustomerFeedbacks();

  });

  // Return the view for the page.
  return (
    <div>
<iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/4e3c174d-8089-425f-8af4-c2b521ccb2ec/page/P8R8C"></iframe>    </div>
  );
}