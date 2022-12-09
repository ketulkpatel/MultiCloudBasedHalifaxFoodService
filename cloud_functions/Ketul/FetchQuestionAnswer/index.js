exports.login = (req, res) => {

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
  const email = data.email;
  return firestore.collection(COLLECTION_NAME).where("email", "==", email).get().then(doc => {
    
    return res.status(200).send(JSON.stringify(doc.docs));
  }).catch(err => {
    console.error(err);
    return res.status(404).send({
      error: 'unable to get',
      err
    });
  });

};