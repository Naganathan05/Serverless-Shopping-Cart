// Load AWS-SDK for Node JS
const AWS = require('aws-sdk')

// Configure the Region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB Service Object
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async function(event, context, callback){
    let responseCode = 200
    let responseBody = ""
    const new_quantity = parseInt(event.Quantity, 10)
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

    if(new_quantity === 0){
        var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
        const params = {
            TableName: "Anonymous Cart",
            Key: {
                Product_Id: {
                    S: event.path.split("/")[2]
                },
                User_Id: {
                    S: userIdValue
                }
            }
        };

        try {
            await ddb.deleteItem(params).promise();
            responseBody = "Updated Product Quantity In Cart"
        } catch (error) {
            responseCode = 500
            responseBody = error
            console.log("Error in Updating Cart", error)
        }
    }
    else{
        const command = {
            TableName: "Anonymous Cart",
            Key: {
                Product_Id: {
                    S: event.path.split("/")[2]
                },
                User_Id: {
                    S: userIdValue
                }
            },
            UpdateExpression: "set Quantity = :quantity",
            ExpressionAttributeValues: {
                ":quantity": new_quantity
            },
            ReturnValues: "ALL_NEW"  //Returns all new attributes of the product that has bee updated
        };

        //Command passed to the DynamoDB Client Object
        try {
            const result = await docClient.send(command)
            responseBody = result
        } catch (err) {
            responseCode = 500
            responseBody = err
        }
    }

    const response = {
        statusCode: responseCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(responseBody)
    }
    //Return the response JSON object to the caller
    return response;
}