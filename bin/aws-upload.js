'use strict';

require('dotenv').load();

const s3Upload = require('../lib/aws-s3-upload');
const mongoose = require('../app/middleware/mongoose');
const Upload = require('../app/models/upload');

let file = {
  path: process.argv[2],
  title: process.argv[3]
};

// Upload.create(upload?)

s3Upload(file)
  .then(function(response){
    console.log("inside then block");
    console.log("response is ", response);
    console.log("url is ", response.Location);
    return Upload.create({
      url: response.Location,
      title: file.title,
    });
  })
  .then(function(upload){
    console.log("mongo create was successful");
    console.log("upload is ", upload);
  })
  .catch(console.error)
  .then(function(){
    mongoose.connection.close();
  });
