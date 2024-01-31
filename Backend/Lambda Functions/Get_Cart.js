// Load AWS-SDK for Node JS
const AWS = require('aws-sdk')

// Configure the Region
AWS.config.update({ region: "us-east-1" });

// Create the DynamoDB Service Object
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { BatchGetCommand, DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const {
    ApiGatewayHttpApiProxyEventHandler,
  } = require("@anzp/aws-lambda-cookie");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async function(event, context, callback){
    let responseCode = 200
    let responseBody = ""
    let userIdValue;

    const handler = new ApiGatewayHttpApiProxyEventHandler(event);
    const cookies = handler.getCookies();
    console.log({cookies}); 

    const command = new BatchGetCommand({
        RequestItems: {
            Anonymous_Cart: {
                Keys: [
                    {
                        User_Id: {S: "5"}
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


function parseUserIdFromCookie(cookieHeader) {
    if (!cookieHeader) {
      console.log('Cookie header nt found');
      return null;
    }
  
    const userIdCookie = cookieHeader.find(cookie => cookie.includes('userId'));
  
    if (userIdCookie) {
      const userIdValue = userIdCookie.split(';')[0].split('=')[1];
      console.log('User ID:', userIdValue);
      return userIdValue;
    } else {
      console.log('User ID not found in cookie');
      return null;
    }
  }