// Load AWS-SDK for Node JS
const AWS = require('aws-sdk')

// Configure the Region
AWS.config.update({ region: "us-east-1"});

// Create the DynamoDB Service Object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

