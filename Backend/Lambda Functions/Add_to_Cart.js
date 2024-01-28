// Load AWS-SDK for Node JS
const AWS = require('aws-sdk')

// Configure the Region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB Service Object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

exports.handler = function(event, context, callback){
    let responseCode = 200
    let responseBody = ""
    const params = {
        TableName: "Anonymous_Cart",
        Item: {
            Product_Id: {S: event.Product_Id},
            Product_Name: {S: event.Product_Name},
            Quantity: {S: event.Quantity_Id},
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