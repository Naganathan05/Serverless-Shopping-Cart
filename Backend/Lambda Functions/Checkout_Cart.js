// Load the AWS-SDK for Node JS
const AWS = require('aws-sdk');

// Configure the Region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB Service Object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = function(event, context, callback){
    let responseCode = 200
    let responseBody = ""
    let UserId = event.requestContext.authorizer.claims.sub;
    const params = {
        TableName: "Cart",
        Key: {
            userId: {
                S: UserId
            }
        }
    };
    ddb.deleteItem(params, (err, data) => {
        if(err){
            responseCode = 500
            responseBody = err
        }
        else{
            responseBody = data
        }
        const response = {
            statusCode: responseCode,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(responseBody)
        };
        callback(null, response)
    });

    console.log("Successfully Checked Out Cart for ", UserId);
}