/**
 * @author Ketul Patel - B00900957.
 * @project Serverless- Project - G2.
 */

import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Reference : https://www.geeksforgeeks.org/how-to-develop-user-registration-form-in-reactjs/ 
// Function for the 3rd factor authentication while login.
export default function LoginForm_3() {

  // States for registration for log in form-3.
  const [cipherText, setCipherText] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State object to get data passed in navigation.
  const { state } = useLocation();

  // To navigate to different URL.
  const navigate = useNavigate();

  // useEffect to handle state null.
  useEffect(() => {
    if (state == "" || state == null) {
      navigate('/login-1');
    }
  }, []);


  // Handling cipher text empty.
  const checkCipherText = (e) => {
    if (cipherText == "" || cipherText == null) {
      return true;
    }
    return false;
  };

  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle form input validations.
    if (checkCipherText()) {
      setError(true);
      setErrorMessage("The text cannot be empty.");
    }
    else {

      // Get the day, month and year of the logged in user.
      const date = new Date();
      let day = date.getDate();
      const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
      ];

      const d = new Date();
      let monthName = monthNames[d.getMonth()];

      day = day + " " + monthName;
      debugger
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      // Trigger URL for the lambda function to store data in the dynambo database.
      let url = "https://h4ggpc6yhlhmxyd2fs2ozi7qky0dacdl.lambda-url.us-east-1.on.aws/";

      // Method POST with body data in the JSON format.
      let options = {
        method: "POST",
        body: JSON.stringify({
          cipherText: cipherText,
          operation: "LOGIN",
          loginDate: day,
          loginMonth: month,
          loginYear: year,
          email: state.email
        }),
      };

      // Sending the request to store the data to the dynamodb database using lambda function.
      // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.
      await fetch(url, options)
        .then((response) => response.json()).then((res) => {

          let responseBody = res.body;

          if (responseBody.status) {

            let user = responseBody.data.user.Items[0];

            // Store data to localstorage.
            localStorage.setItem("email", state.email);
            localStorage.setItem("role", user.Role);
            localStorage.setItem("PhoneNumber", state.PhoneNumber);
            localStorage.setItem("Name", state.Name);

            // Navigate to pages based on the role.
            if (user.Role == 'customer') {
              navigate('/customer-home', { 'state': { 'email': state.email } })
            }
            else {
              navigate('/restaurant-home', { 'state': { 'email': state.email } })
            }

          }
          else {
            setError(true);
            setErrorMessage(responseBody.message);
          }

        })
        .catch((error) => {
          setError(true);
          setErrorMessage("Something went wrong. Try again.");
        })

    }

  };


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

  return (
    <div className="form">
      <div>
        <h1>User Login</h1>
      </div>

      <div className="messages">
        {showError()}
        <h2> Step 3 out of 3.</h2>
      </div>

      <form>
        <label className="label">Enter a text you received during register: </label>
        <input
          type="email" className="input"
          value={cipherText}
          onChange={(e) => setCipherText(e.target.value)} /><br></br>
        <button onClick={handleSubmit} className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}