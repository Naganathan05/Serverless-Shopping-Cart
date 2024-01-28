// Load AWS-SDK for Node JS
const AWS = require('aws-sdk')

// Configure the Region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB Service Object
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { BatchGetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async function(event, context, callback){
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

    const command = new BatchGetCommand({
        RequestItems: {
            Anonymous_Cart: {
                Keys: [
                    {
                        User_Id: userIdValue
                    }
                ],
                ProjectionExpression: "Product_Id, Product_Name, Quantity, Amount"
            }
        }
    });

    const result = await docClient.send(command)
    console.log(result.Responses["Anonymous_Cart"])
    responseBody = result.Responses["Anonymous_Cart"];
    const response = {
        statusCode: responseCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify(responseBody)
    }
    return response;
}