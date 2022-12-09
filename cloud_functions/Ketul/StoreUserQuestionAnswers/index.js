exports.main = (req, res) => {

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods','*');
  res.setHeader('Access-Control-Allow-Headers','*');
  'use strict';
  const Firestore = require('@google-cloud/firestore');

  const PROJECTID = 'csci5410g2';
  const COLLECTION_NAME = 'QuestionAnswer';

  const firestore = new Firestore({
    projectId: PROJECTID,
    timestampsInSnapshots: true
  });
  
  const data = JSON.parse ((req.body) || {});
  let question = data.question;
  let answer = data.answer;
  const email = data.email;

  return firestore.collection(COLLECTION_NAME).add({
    question,
    answer,
    email
  }).then(doc => {
    return res.status(200).send(doc);
  }).catch(err => {
    console.error(err);
    return res.status(404).send({
      error: 'unable to store',
      err
    });
  });

};