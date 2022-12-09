/**
 * @author Ketul Patel - B00900957.
 * @project Serverless- Project - G2.
 */

import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Reference : https://www.geeksforgeeks.org/how-to-develop-user-registration-form-in-reactjs/ 
// Function for the 3rd factor authentication while register.
export default function RegisterForm_3() {

  // States for registration form 3.
  const [key, setKey] = useState('');
  const [email, setEmail] = useState('');
  const [plainText, setPlainText] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State to fetch the data provided in the state while navigation.
  const { state } = useLocation();

  // To navigate to different URL.
  const navigate = useNavigate();


  // Handling state empty.
  const checkState = async (e) => {
    if (state == "" || state == null) {
      navigate('/register-1');
    }
    else {
      setEmail(state.email);
    }
  };

  useEffect(() => {
    checkState();
  }, []);

  // Handling key length.
  const checkKey = (e) => {
    if (key.length == 4) {
      return false;
    }
    return true;
  };

  // Handling plain text.
  const checkPlainText = (e) => {
    if (plainText == "" || plainText == null) {
      return true;
    }
    return false;
  };

  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form submission check if input data is correct or not.
    if (checkKey()) {
      setError(true);
      setErrorMessage("Key must have length exact 4.")
    }
    else if (checkPlainText()) {
      setError(true);
      setErrorMessage("Text can not be empty.")
    }

    else {

      // Trigger URL for the lambda function to store data in the dynambodb database.
      let url = "https://h4ggpc6yhlhmxyd2fs2ozi7qky0dacdl.lambda-url.us-east-1.on.aws/";

      // Method POST and body data in JSON format.
      let options = {
        method: "POST",
        body: JSON.stringify({
          key: key,
          plainText: plainText,
          operation: "REGISTER",
          email: email
        }),
      };

      // Sending the request to store the data to the dynambo database using lambda function.
      // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.
      await fetch(url, options)
        .then((response) => response.json()).then((res) => {

          let responseBody = res.body;

          // If lambda ran successfully, then navigate provide cipherText to the user.
          if (responseBody.status) {
            let cipherText = responseBody.data
            navigate('/register-4', { state: { "cipherText": cipherText } });
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

  // Return the view for the page.
  return (
    <div className="form">
      <div>
        <h1>User Registration</h1>
      </div>

      <div className="messages">
        {showError()}
        <h2> Step 3 out of 3.</h2>
      </div>

      <form>

        <label className="label">Enter a key(must have excatly length of 4.): </label>
        <input className="input"
          value={key} type="text"
          onChange={(e) => setKey(e.target.value)} /> <br></br>

        <label className="label">Enter a text for key: </label>
        <input
          type="email" className="input"
          value={plainText}
          onChange={(e) => setPlainText(e.target.value)} /><br></br>

        <button onClick={handleSubmit} className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}