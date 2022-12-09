/**
 * @author Ketul Patel - B00900957.
 * @project Serverless- Project - G2.
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import React from 'react';
import KommunicateChatBot from '../OnlineSupportModule/ChatWidget';
// Function to display the home page of the customers.
export default function CustomerHome() {

  // Required states for the page.
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [chatRooomID, setChatRoomID] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  // To navigate to different URL.
  const navigate = useNavigate();

  useEffect(() => {

    let emailID = localStorage.getItem("email");
    
    // Check if state is empty/null.
    if (emailID == "" || emailID == null) {
      navigate('/login-1');
    }
    else {

      // Trigger URL for the lambda function to fetch restaurants from dynambodb database.
      let url = "https://syztnb4p4ciwt5sri7qi4bvltq0dgpak.lambda-url.us-east-1.on.aws/";

      // Method as POST.
      let options = {
        method: "POST"
      };

      // Sending the request to store the data to the dynambo database using lambda function.
      // Reference: https://blog.logrocket.com/modern-api-data-fetching-methods-react/.
      const getRestaurants = async () => {

        await fetch(url, options)
          .then((response) => response.json()).then((res) => {

            let items = res.body.data.Items

            for (let item in items) {
              let id = items[item].EmailID;
              var encryptedID = btoa(id);
              items[item]['encryptedID'] = encryptedID
            }

            setRestaurants(items);
          })
          .catch((error) => {
            debugger
            setError(true);
            setErrorMessage("Something went wrong. Try again.");
          })
      }

      getRestaurants();
    }
  }, []);

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
  const handleOnClickChatRoom = () => {
    debugger
    if(chatRooomID == "" || chatRooomID == null){
      setError(true);
      alert("Please provide chatID to go to chat room.")
    }
    else{
      localStorage.setItem("chatRoomID", chatRooomID);
      navigate('/chat');
    }

  };

  // Return the view for the page.
  return (
    <div className="form">
      <div>
        <h1>Halifax Foodie - G2 - CustomerHome</h1>
      </div>
      <div className="messages">
        {showError()}
        <h2> List of Restaurants</h2>
      </div>
      <div>

      <form>
        <label className="label">Enter ChatID</label>
        <input
        type="text" className="input"
        value={chatRooomID}
        onChange={(e) => setChatRoomID(e.target.value)} />
        <button onClick={handleOnClickChatRoom}>Go to Chat Room</button>
      </form>
      
      </div>
      <br></br>
      <table>
        <tr>
          <td>RestaurantName</td>
          <td>RestaurantAddress</td>
          <td>RestaurantPhone</td>
          <td>RestaurantEmailAddress</td>
          <td>Feedback</td>
          <td>Details</td>
        </tr>
        {restaurants.map((restaurant) => {
          {
            return (<tr>
              <td>{restaurant.Name}</td>
              <td>{restaurant.Address}</td>
              <td>{restaurant.PhoneNumber}</td>
              <td>{restaurant.EmailID}</td>
              <td> <Link to={`/give-restaurant-feedback/${restaurant.encryptedID}`}>Click here to give feedback.</Link></td>
              <td> <Link to={`/restaurant-menu/${restaurant.encryptedID}`}>Click here to get menu.</Link></td>
            </tr>)
          }
        })}

      </table>

      

        <KommunicateChatBot></KommunicateChatBot>
    </div>
  );
}