/**
 * @author Ketul Patel - B00900957.
 * @project Serverless- Project - G2.
 */

import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


// Reference : https://www.geeksforgeeks.org/how-to-develop-user-registration-form-in-reactjs/ 
// Function for the 2nd factor authentication while register.
export default function RegisterForm_2() {

  // States for the registration form-2.
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [givenAnswer, setAnswer] = useState('');
  const [email, setEmail] = useState('');
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

  // useEffect to check the state immidiately.
  useEffect(() => {
    checkState();
  }, []);

  // Handling question empty.
  const checkSelectedQuestion = (e) => {
    if (selectedQuestion == "" || selectedQuestion == null) {
      return true;
    }
    return false;
  };

  // Handling answer empty.
  const checkAnswer = (e) => {
    if (givenAnswer == "" || givenAnswer == null) {
      return true;
    }
    return false;
  };

  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle if provided input data is correct or not.
    if (checkSelectedQuestion()) {
      alert("Please select a question.")
    }
    else if (checkAnswer()) {
      alert("Please provide an answer.")
    }
    else {

      // Trigger URL for the cloud function to store data in the firestore database.
      let url = "https://us-central1-csci5410g2.cloudfunctions.net/StoreQuestionAnswer";

      // Method POST with body data in the JSON format.
      let options = {
        method: "POST",
        body: JSON.stringify({
          question: selectedQuestion,
          answer: givenAnswer,
          email: email
        }),
      };

      // Sending the request to store the data to the firestore database using cloud function.
      // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.
      await fetch(url, options)
        .then((response) => {

          // Check if data is successfully added or not.
          if (response.ok) {
            navigate('/register-3', { state: { "email": state.email } });
          }
          else {
            setError(true);
            setErrorMessage("There is a problem with saving data.");
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
        <h2>Step 2 out of 3.</h2>
      </div>

      <form>
        <label className="label">Select Question: </label>

        <select onChange={(e) => setSelectedQuestion(e.target.value)}>
          <option value=""> Select a question</option>
          <option value="What is your nick name?"> What is your nick name?</option>
          <option value="What is your favorite color?">What is your favorite color?</option>
          <option value="What is your favorite animal?">What is your animal?</option>
        </select> <br></br>
        <label className="label">Answer for the question: </label>
        <input
          type="text" className="input"
          value={givenAnswer}
          onChange={(e) => setAnswer(e.target.value)} /><br></br>

        <button onClick={handleSubmit} className="btn" type="submit">
          Next
        </button>
      </form>
    </div>
  );
}