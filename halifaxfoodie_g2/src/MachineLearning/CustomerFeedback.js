import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Reference : https://www.geeksforgeeks.org/how-to-develop-user-registration-form-in-reactjs/
// Function to submit the customer feedback.
export default function CustomerFeedback() {

  // States for registrations for the feedback.
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [sucess, setSucess] = useState(false);
  const [sucessMessage, setsucessMessage] = useState('');

  // ID from the useParams to get the data from the URL.
  const { id } = useParams();

  // To navigate to different URL.
  const navigate = useNavigate();

  // UseEffect to check id null/empty.
  useEffect(() => {
    if (id == "" || id == null) {
      navigate('/login-1');
    }
  }, []);

  // Handling feedback length.
  const checkFeedback = (e) => {
    if (feedback.length == 0) {
      return true;
    }
    return false;
  };

  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form submission check if input data is correct or not.
    if (checkFeedback()) {
      setError(true);
      setErrorMessage("Feedback can not be empty.")
    }

    else {

      var decryptedID = atob(id);
      var customerID = localStorage.getItem("email");

      // Trigger URL for the lambda function to store customer feedback in the dynambodb database.      
      let url = "https://jaem4472agv25tpwo5gcmo2g740mrver.lambda-url.us-east-1.on.aws/";

      // Method POST and pass data in the JSON format.
      let options = {
        method: "POST",
        body: JSON.stringify({
          RestaurantID: decryptedID,
          Feedback: feedback,
          CustomerID: customerID
        }),
      };

      // Sending the request to store the customer feedback to the dynambo database using lambda function.
      // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.  
      await fetch(url, options)
        .then((response) => response.json()).then((res) => {
          let data = res.body;
          if (data.status) {
            setSucess(true);
            setsucessMessage("YOUR FEEDBACK HAS BEEN SUBMITTED.");
          }
          else {
            let message = data.message;
            setErrorMessage(message);
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

  // Showing error message if error is true
  const showSuccess = () => {
    return (
      <div
        className="success"
        style={{
          display: sucess ? '' : 'none',
        }}>
        <h2>{sucessMessage}</h2>
      </div>
    );
  };

  return (
    <div className="form">
      <div>
        <h1>Your feedback is valuable to us.!</h1>
      </div>

      {/* Calling to the methods */}
      <div className="messages">
        {showError()}
        {showSuccess()}
        <h2> Step 3 out of 3.</h2>
      </div>

      <form>

        <label className="label">Enter feedback: </label>
        <input
          type="email" className="input"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)} /><br></br>
        <button onClick={handleSubmit} className="btn" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}