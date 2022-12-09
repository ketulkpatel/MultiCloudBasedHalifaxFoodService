/**
 * @author Ketul Patel - B00900957.
 * @project Serverless- Project - G2.
 */

import React from 'react';
import { useState } from 'react';
import UserPool from "./UserPool";
import { useNavigate } from 'react-router-dom';

// Reference : https://www.geeksforgeeks.org/how-to-develop-user-registration-form-in-reactjs/ 
// Function for the 1st factor authentication while register.
export default function RegisterForm_1() {

  // States for registration form-1.
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // To navigate to different URL.
  const navigate = useNavigate();


  // Handling name empty.
  const checkName = (e) => {
    if (name == "" || name == null) {
      return true;
    }
    return false;
  };

  // Handling role empty.
  const checkRole = (e) => {
    if (role == "" || role == null) {
      return true;
    }
    return false;
  };

  // Handling email empty.
  const checkEmailEmpty = (e) => {
    if (email == "" || email == null) {
      return true;
    }
    return false;
  };

  // Handling address empty.
  const checkAddressEmpty = (e) => {
    if (address == "" || address == null) {
      return true;
    }
    return false;
  };

  // Handling phone number length.
  const checkPhoneNumber = (e) => {
    if (phoneNumber == "" || phoneNumber == null || phoneNumber.length != 10) {
      return true;
    }
    return false;
  };


  // Handling password empty.
  const checkPassword = (e) => {
    if (password.length < 8) {
      return true;
    }
    return false;
  };

  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form submission check if input data is correct or not.
    if (checkRole()) {
      setError(true);
      setErrorMessage("Type of user must be selected.")
    }
    else if (checkName()) {
      setError(true);
      setErrorMessage("name cannot be empty.")
    }
    else if (checkEmailEmpty()) {
      setError(true);
      setErrorMessage("email cannot be empty.")
    }
    else if (checkAddressEmpty()) {
      setError(true);
      setErrorMessage("address cannot be empty.")
    }
    else if (checkPhoneNumber()) {
      setError(true);
      setErrorMessage("Phone number must be 10 digits.")
    }
    else if (checkPassword()) {
      setError(true);
      setErrorMessage("password must have 8 characters atleast.")
    }
    else {

      // AWS Cognito try to signup the user with email and password.
      // Reference: https://www.youtube.com/watch?v=8WZmIdXZe3Q
      UserPool.signUp(email, password, [], null, async (error, data) => {

        // Handle the error messages from the AWS cognito.
        if (error) {
          setError(true);
          debugger
          if (error.message == "Username should be an email.") {
            setErrorMessage("Please Enter the valid email address.");
          }
          else if (error.message.startsWith('Password')) {
            setErrorMessage(error.message.split(":")[1]);
          }
          else {
            setErrorMessage(error.message);
          }
        }
        else {


          // Function URL for the lambda function to store the other details to the dynamodb.
          let url = "https://nh6quu4lujbb7ssx46bq225kg40pjkfb.lambda-url.us-east-1.on.aws/";

          // Method of request and list of data in JSON format.
          let options = {
            method: "POST",
            body: JSON.stringify({
              name: name,
              email: email,
              phoneNumber: phoneNumber,
              address: address,
              role: role
            }),
          };

          // Add other details such as name, phonenumber, address, role and email to the dynamodb through lambda function.
          // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.
          await fetch(url, options)
            .then((response) => response.json()).then((res) => {

              // Response body.
              let responseBody = res.body;

              // If successful then navigate to second form for registration.
              if (responseBody.status) {
                navigate('/register-2', { state: { "email": email } });
              }

              // Else print the error message.
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
        <h2> Step 1 out of 3.</h2>
      </div>

      {/* <form> */}
      {/* <form> */}
  <div class="form-group">
    
        <label className="label">Type of user: </label>
        <input type="radio" name="role" value="customer" onChange={(e) => setRole(e.target.value)}></input>
        <label for="html"> Customer </label>
        <input type="radio" class="form-control" name="role" value="restaurant" onChange={(e) => setRole(e.target.value)}></input>
        <label for="css"> Resturant </label><br></br>

        <label className="label">Customer/Restaurant Name: </label>
        <input className="input" class="form-control"
          value={name} type="text"
          onChange={(e) => setName(e.target.value)} /> <br></br>

        <label className="label">Email: </label>
        <input
          type="email" className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)} /><br></br>

        <label className="label">Address: </label>
        <input
          type="text" className="input"
          value={address}
          onChange={(e) => setAddress(e.target.value)} /><br></br>

        <label className="label">Phone number: </label>
        <input type="text" pattern="[0-9]{10}"
          className="input"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)} /> <br></br>

        <label className="label">Password: </label>
        <input className="input"
          value={password} type="password"
          onChange={(e) => setPassword(e.target.value)} /><br></br>

        <button onClick={handleSubmit} className="btn" type="submit">
          Next
        </button>
        </div>
      {/* </form> */}
      </div>
 
  );
}