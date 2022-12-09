'use strict';

const fetch = require('node-fetch')
const { v4: uuidv4,stringify:uuidStringify } = require('uuid');
// import { v4 as uuidv4 } from 'uuid'
// import { stringify as uuidStringify } from 'uuid';

const access_token = 'ya29.a0AeTM1ifY0adW9efqjwFdmI0inXiKrHeuZSfLoNvLldErxaelVrwZbVbck9m946Rn7kryGvlmT3-3LPZTHOGK7DhOdbHbVL6w9aro_WxGeOZ-FyoViR9VfOUtp2okzG9GkDsx8C5iLFnYf6NfG7xWoiW12t4Z5FKGE3UuSAaCgYKAaESARISFQHWtWOmboMsuiRYecbA1C2MjnDsIw0173';
const topic = 'projects/serverless-5410-365819/topics/customer_complaints';

module.exports.publish = async (event) => {
  const jsonString = event.body;
  //const uuid = uuidv4()
  //const uuid_to_string = uuidStringify(uuid);
  //const databuffer = { "uuid": uuid, "restaurant": "res@gmail.com", "customer": "cus@gmail.com","complaint_string" : "want redund" }
  //const jsonString = JSON.stringify(databuffer);
  const data= await fetch ('https://pubsub.googleapis.com/v1/' + topic + ':publish',{
        method:'POST',
        headers: {
            'Authorization': 'Bearer ' + access_token,
            'Content-type': 'application/json'
        },
         body:'{"messages":[{"data":"' + Buffer.from(jsonString).toString('base64') + '"}]}'
    });
    
    console.log(await data.json())

    const response = {
      statusCode: 200,
      body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
