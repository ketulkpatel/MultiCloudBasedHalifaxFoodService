import './App.css';
import LoginForm_1 from '../src/UserManagement/LoginForm_1';
import LoginForm_2 from '../src/UserManagement/LoginForm_2';
import LoginForm_3 from '../src/UserManagement/LoginForm_3';
import RegisterForm_1 from '../src/UserManagement/RegisterForm_1';
import RegisterForm_2 from '../src/UserManagement/RegisterForm_2';
import RegisterForm_3 from '../src/UserManagement/RegisterForm_3';
import RegisterForm_4 from '../src/UserManagement/RegisterForm_4';
import Chat from '../src/ChatModule/Chat';
import HomeForm from '../src/UserManagement/HomeForm';
import RestaurantHome from '../src/RestaurantView/RestaurantHome';
import RestaurantFeedback from './MachineLearning/RestaurantFeedback';
import CustomerHome from './CustomerView/CustomerHome';
import RestaurantMenu from './CustomerView/RestaurantMenu';
import ResturantRecipeDetails from './CustomerView/RestaurantRecipeDetails';
import CustomerFeedback from './MachineLearning/CustomerFeedback';
import ChatWidget from '../src/OnlineSupportModule/ChatWidget';
import React from 'react';
import { Routes, Route} from 'react-router-dom';
import UploadFileToS3 from './DataProcessing/uploadFileToS3';
import ExtractRecipe from './DataProcessing/ExtractRecipe';
import DataVisualization from './DataVisualization/DataVisualization';
function App() {
  return (
   
    <div className="App">
      <Routes>
      <Route path="/" element={<HomeForm />} />
        <Route path="/login-1" element={<LoginForm_1 />} />
        <Route path="/login-2" element={<LoginForm_2 />} />
        <Route path="/login-3" element={<LoginForm_3 />} />
        <Route path="/register-1" element={<RegisterForm_1 />} />
        <Route path="/register-2" element={<RegisterForm_2 />} />
        <Route path="/register-3" element={<RegisterForm_3 />} />
        <Route path="/register-4" element={<RegisterForm_4 />} />
        <Route path= "/restaurant-menu/:id" element={<RestaurantMenu />} />
        <Route path= "/recipe-details" element={<ResturantRecipeDetails />} />
        <Route path= "/list-of-customer-feedbacks" element={<RestaurantFeedback/>} />
        <Route path="/restaurant-home" element={<RestaurantHome />} />
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route path="/give-restaurant-feedback/:id" element={<CustomerFeedback />} />
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/upload-file" element={<UploadFileToS3 />} />
        <Route path="/extract-recipe" element={<ExtractRecipe />} />
        <Route path="/visulization-graphs" element={<DataVisualization />} />
    </Routes>
    </div>
  );
}

export default App;
