'use strict';

const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const mime = require('mime');

const path = require('path');
const crypto = require('crypto');

const s3Upload = function(file){
  let contentType = mime.lookup(file.path);
  let ext = path.extname(file.path);
  let folder = new Date().toISOString().split('T')[0];

  let stream = fs.createReadStream(file.path);
  let bucket = process.env.AWS_S3_BUCKET_NAME;

  return new Promise(function(resolve, reject){
    crypto.randomBytes(16, function(error, buffer){
      if(error){
        reject(error);
      }
      else{
        resolve(buffer.toString('hex'));
        // console.log("buffer is", buffer);
        // console.log("buffer.toString is ", buffer.toString('hex'));
      }
    });
  })
  .then(function(filename){
    const params = {
      ACL: 'public-read',
      Bucket: bucket,
      Key: `${folder}/${filename}${ext}`,
      // Key: folder + '/' + file.title + ext,
      Body: stream,
      ContentType: contentType,
    };

    return new Promise(function(resolve, reject){
      s3.upload(params, function(error, data){
        if(error){
          reject(error);
        }
        else{
          resolve(data);
        }
      });
    });
  });
};

module.exports = s3Upload;
