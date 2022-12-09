// Reference: https://cloud.google.com/nodejs/docs/reference/aiplatform/latest
// Reference: https://github.com/googleapis/nodejs-ai-platform/blob/main/samples/predict-text-classification.js
exports.predict = async (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods','*');
  res.setHeader('Access-Control-Allow-Headers','*');
  'use strict';
  const endpointId = "8763622244816519168";
  const project = 'csci5410g2';
  const location = 'us-central1';
  
  const data = JSON.parse ((req.body) || {});
  const text = data.text;
  
  console.log(text);
  // Imports the Google Cloud Prediction Service Client library
  const aiplatform = require('@google-cloud/aiplatform');
  const {instance, prediction} =
    aiplatform.protos.google.cloud.aiplatform.v1.schema.predict;

  // Imports the Google Cloud Model Service Client library
  const {PredictionServiceClient} = aiplatform.v1;

  // Specifies the location of the api endpoint
  const clientOptions = {
    apiEndpoint: 'us-central1-aiplatform.googleapis.com',
  };

  // Instantiates a client
  const predictionServiceClient = new PredictionServiceClient(clientOptions);

  
  const endpoint = `projects/${project}/locations/${location}/endpoints/${endpointId}`;
  const predictionInstance =
    new instance.TextClassificationPredictionInstance({
      content: text,
    });

   const instanceValue = predictionInstance.toValue();

   const instances = [instanceValue];
   const request = {
     endpoint,
     instances,
   };

   const [response] = await predictionServiceClient.predict(request);
   const response_data = []

  try {
   for (const predictionResultValue of response.predictions) {
    
     const predictionResult =
       prediction.ClassificationPredictionResult.fromValue(
         predictionResultValue
       );
       
     for (const [i, label] of predictionResult.displayNames.entries()) {
      let response_dict = {}
      response_dict['label'] = label;
      response_dict['confidences'] = predictionResult.confidences[i];
      response_dict['tIDs'] = predictionResult.ids[i];
      response_data.push(response_dict)
     }
   }
   return res.status(200).send(response_data);
  }
  catch(error){
    return res.status(404).send(error);
  }
  
};
