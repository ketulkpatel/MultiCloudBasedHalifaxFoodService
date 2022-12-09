/**
 * @author Ketul Patel - B00900957.
 * @project Serverless- Project - G2.
 */

import { useNavigate } from 'react-router-dom';
import React from 'react';
export default function HomeForm() {

  // To navigate to different URL.
  const navigate = useNavigate();

  // Handling the login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    navigate('/login-1');
  };


  // Handling the register submission
  const handleRegister = async (e) => {
    e.preventDefault();
    navigate('/register-1');
  };


  // return the view for the page.
  return (
    <div className='form'>
      <div>
        <h1>Halifax Foodie - G2</h1>
      </div>

{/* <div className="form-group"> */}
        <button onClick={handleLogin} className="btn" type="submit">
          Login
        </button>
        <button onClick={handleRegister} className="btn" type="submit">
          Register
        </button>
      {/* </div> */}
    </div>
  );
}