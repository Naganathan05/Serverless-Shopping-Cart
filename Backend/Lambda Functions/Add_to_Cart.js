// Load AWS-SDK for Node JS
const AWS = require('aws-sdk')

// Configure the Region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB Service Object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = function(event, context, callback){
    let responseCode = 200
    let responseBody = ""
    let userIdValue;

    const cookieHeader = event.headers['cookie'] || event.headers['Cookie'];
    if (cookieHeader) {
    const userId = cookieHeader.split(';').find(cookie => cookie.includes('userId'));
    if (userId) {
        const userIdValue = userId.split('=')[1];
        console.log('User ID:', userIdValue);
        // Now you can use userIdValue in your Lambda function
    } else {
        console.log('User ID not found in cookie');
    }
    } else {
    console.log('Cookie header not found in the request');
    }

    const params = {
        TableName: "Anonymous_Cart",
        Item: {
            User_Id: {S: userIdValue},
            Product_Id: {S: event.Product_Id},
            Product_Name: {S: event.Product_Name},
            Quantity: {S: event.Quantity},
            Amount: {S: event.Amount}
        }
    };

    ddb.putItem(params, (err, data) => {
        if(err){
            console.log("Error at adding to anonymous cart", err)
            responseCode = 500
            responseBody = err;
        }
        else{
            console.log("Successfully Added to Cart")
            responseBody = "Successfully Added to Cart";
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
}