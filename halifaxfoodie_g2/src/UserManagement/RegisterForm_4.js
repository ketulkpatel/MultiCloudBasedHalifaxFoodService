/**
 * @author Ketul Patel - B00900957.
 * @project Serverless- Project - G2.
 */

import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Function to provide cipher text to user.
export default function RegisterForm_4() {

  // States for page.
  const [cipherText, setCipherText] = useState('');
  const { state } = useLocation();

  // To navigate to different URL.
  const navigate = useNavigate();

  // Handling the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    navigate('/login-1');
  };

  // Handling state empty.
  const checkState = async (e) => {
    if (state == "" || state == null) {
      navigate('/register-1');
    }
    else {
      setCipherText(state.cipherText);
    }
  };

  // Check state using useEffect.
  useEffect(() => {
    checkState();
  }, []);

  // Return the view for the page.
  return (
    <div className="form">
      <div>
        <h1>User CipherText</h1>
      </div>

      <form>
        <h2>NOTE THE BELOW TEXT (IT WILL HELP IN LOGIN PROCESS). </h2>
        <p>Your text is: {cipherText} </p>
        <button onClick={handleSubmit} className="btn" type="submit">
          Back to login?
        </button>
      </form>
    </div>
  );
}