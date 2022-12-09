import React, { Component } from 'react';
import axios from 'axios';
import { async } from '@firebase/util';

export default class ExtractRecipe extends Component {
  //declaring variables related to restaurant
   restaurant_id;
   restaurant_name;
  constructor(props) {
    super(props);
    //setting the restaurant_id as the email of currently logged in user
    this.restaurant_id = localStorage.getItem("email");
    //this.restaurant_name=window.localStorage.getItem("Name");
    this.state = {
      filename: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  //updates the filename on each change in the text field
  handleChange(event) {
    const inputValue = event.target.value;
    const stateField = event.target.name;
    this.setState({
      [stateField]: inputValue,
    });
    console.log(this.state);
  }

  //handles the the on submit ,when the user clicks on extract this function is called.
  async handleSubmit(event) {
    event.preventDefault();
    const { filename} = this.state;
    await fetch ('https://ualgvbsbiib3xddxeotkuz6vh40lyglx.lambda-url.us-east-1.on.aws/',{
        method:'POST',
        body:JSON.stringify({
            key1:filename,
            key2:this.restaurant_id
        })
    })
    .then((response)=>response.json().then(async (res)=>{
        console.log(res)
    }))
    // await axios.post(
    //   'https://ualgvbsbiib3xddxeotkuz6vh40lyglx.lambda-url.us-east-1.on.aws/',
    //   { key1: `${filename}`,key2: `${this.restaurant_id}` }
    // );
  }

  //Html part
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>File Name:</label>
          <input
            type="text"
            name="filename"
            onChange={this.handleChange}
            value={this.state.filename}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }

}