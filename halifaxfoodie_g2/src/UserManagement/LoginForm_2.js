import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


// Reference : https://www.geeksforgeeks.org/how-to-develop-user-registration-form-in-reactjs/ 
// Function for the 2nd factor authentication while login.
export default function LoginForm_2() {

  // Required state for the login form-2.
  const [question, setQuestion] = useState('');
  const [givenAnswer, setGivenAnswer] = useState('');
  const [actualAnswer, setActualAnswer] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // State object to get the data passed while navigation.
  const { state } = useLocation();

  // navigate to different URL. 
  const navigate = useNavigate();

  // UseEffect to get the data.
  useEffect(() => {

    // Check the state is null/empty.
    if (state == "" || state == null) {
      navigate('/login-1');
    }
    else {

      // Trigger URL for the lambda function to fetch question in the dynamodb database.
      let url = "https://us-central1-csci5410g2.cloudfunctions.net/FetchQuestionAnswer";

      // Method POST with body data in the JSON format.
      let options = {
        method: "POST",
        body: JSON.stringify({
          email: state.email
        }),
      };

      // Sending the request to fetch the question/answer to the firestore database using cloud function.
      // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/. 
      const getQuestionAnswer = async () => {
        await fetch(url, options)
          .then((response) => response.json()).then((res) => {
            let doc = res[0];
            let actualAnswer = doc._fieldsProto['answer'].stringValue
            let question = doc._fieldsProto['question'].stringValue
            setQuestion(question);
            setActualAnswer(actualAnswer);
          })
          .catch((error) => {
            setError(true);
            setErrorMessage("Something went wrong. Try again.");
          })
      }

      getQuestionAnswer();
    }
  }, []);


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

    // Form submission check if input data is correct or not.
    if (checkAnswer()) {
      alert("Please provide an answer.")
    }
    else {

      // Check if actual and given answer are equal or not.
      if (actualAnswer == givenAnswer) {
        navigate('/login-3', { state: { "email": state.email } });
      }
      else {
        setError(true);
        setErrorMessage("The given answer is wrong. Try again!")
      }

    };
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
        <h2>Step 2 out of 3.</h2>
      </div>

      <form>
        <label className="label">Selected Question: </label> {question}<br></br>
        <label className="label">Answer for the question: </label>
        <input
          type="text" className="input"
          value={givenAnswer}
          onChange={(e) => setGivenAnswer(e.target.value)} /><br></br>
        <button onClick={handleSubmit} className="btn" type="submit">
          Next
        </button>
      </form>
    </div>
  );
}