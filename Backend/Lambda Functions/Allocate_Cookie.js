// Load AWS-SDK for Node JS
const AWS = require('aws-sdk')

// Configure the AWS Region
AWS.config.update({ region: "us-east-1" });
const uuid = require('uuid')

exports.handler =function(event, context, callback){
    const uid = uuid();
    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Set-Cookie": [
                `userId=${uid}; Max-Age=${60*60*24}; Path=/; HttpOnly`
            ]            
        },
        body: JSON.stringify({
            message: "Session Id Allocated"
        }),
        isBase64Encoded: false
    }
    callback(null, response);
    console.log(uid);
}