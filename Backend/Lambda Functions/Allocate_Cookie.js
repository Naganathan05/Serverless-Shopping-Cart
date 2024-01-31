// Load AWS-SDK for Node JS
const AWS = require('aws-sdk')

// Configure the AWS Region
AWS.config.update({ region: "us-east-1" });
const {v4 : uuidv4} = require('uuid')

exports.handler =function(event, context, callback){
    const uid = "5"
    const response = {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Credentials" : true,
            "Access-Control-Allow-Origin": "*",
            "access-control-expose-headers": "Set-Cookie",
            "Set-Cookie": [
                `userId=${uid}, Max-Age=${60*60*24}, Path=/, HttpOnly, SameSite=None, Secure`
            ] 
        },
        "body": JSON.stringify({
            message: "Session Id Allocated"
        }),
        "isBase64Encoded": false
    }
    callback(null, response);
    console.log(uid);
}