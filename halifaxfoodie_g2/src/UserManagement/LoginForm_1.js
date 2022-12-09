import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import UserPool from "./UserPool";
import { CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import React from 'react';

// Reference : https://www.geeksforgeeks.org/how-to-develop-user-registration-form-in-reactjs/ 
// Function for the 1st factor authentication while login.
export default function LoginForm_1() {

  // Required states for the login form-1.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // To navigate to different URL.
  const navigate = useNavigate();

  // Handling the email change
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  // Handling the password change
  const handlePassword = (e) => {
    setPassword(e.target.value);
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

  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form submission check if input data is correct or not.
    if (email === '') {
      alert("email id cannot be empty.")
    }
    else if (password === '') {
      alert("password cannot be empty.")
    }

    else {

      // Reference: https://www.youtube.com/watch?v=8WZmIdXZe3Q
      // Create CognitoUser obejct with email and UserPool.
      const user = new CognitoUser({
        Username: email,
        Pool: UserPool
      })

      // Authentication details object with UserName and Password.
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      })

      // Authenticate CognitoUserObejct providing authentication details object to it.
      user.authenticateUser(authenticationDetails, {

        // On sucess navigate to page-2 provide email into state object.
        onSuccess: (data) => {
          navigate('/login-2', { state: { "email": email } });
        },
        // On failure display message to the user.
        onFailure: (data) => {
          setError(true);
          setErrorMessage(data.message)
        }
      })
    }

  };

  // Return the view for the page.
  return (
    <div className="form">
      <div>
        <h1>User login</h1>
      </div>

      <div className="messages">
        {showError()}
        <h2>Step 1 out of 3.</h2>
      </div>
      <form className='form-group'>

        <label className="label">Email</label>
        <input onChange={handleEmail} className="form-control"
          value={email} type="email" />

        <label className="label">Password</label>
        <input onChange={handlePassword} className="input"
          value={password} type="password" />

        <button onClick={handleSubmit} className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}