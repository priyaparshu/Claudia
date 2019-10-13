# Claudia

In a serverless application, your requests are processed with an API router layer that has only one job: it accepts HTTP requests and routes them to the underlying business layer services. The API router in a serverless architecture is always independently managed. That means that application developers don’t maintain the API router, and it’s scaled automatically by the serverless provider to accept all the HTTP requests your API is receiving. 
Also, you pay only for the requests that are processed.

Claudia is a Node.js library that eases the deployment of Node.js projects to AWS Lambda and API Gateway. It automates all the error-prone deployment and configuration tasks, 
and sets everything up the way JavaScript developers expect out of the box.

Rather than try to replace the AWS SDK, Claudia is built on top of it, and Claudia automates most common workflows with single commands.

In this application, requests are accepted by API Gateway. After the requests are parsed, then we take the help of Claudia API Builder to do internal routing to differentiate internal action. This we have to do because we are using single lambda to implement all our functions.
Based on the received request, Claudia API builder will invoke corresponding handler. After the requests are processed, a response is returned to the user. The response is passed through both Claudia API builder and API gateway.

In apib11.js, we create a GET pizza service that lists all available pizzas. We first import Claudia API builder module. Then we create an instance of it and export it. We create a route '/pizzas' and a handler that returns a list of all pizzas.

deployment:
claudia create \  
  --region us-east-1 \ 
  --api-module apib11.js
  Claudia will create a claudia.json file in the root of your project for its internal use. This file will contain the base url that you would use for testing. Copy the url and paste it in the browser. Make sure to append your route to the base URL
  
  Structuring your folder:
     Create a folder called handlers in your project root, and create a get-pizzas.js file inside it. This will contain the getPizzas handler.
     create a getPizzas handler function and export it so that you can require it from your entry file. 
     
     create a folder in the root of your Pizza API project, and name it data. 
     Then create a file in your new folder, and name it pizzas.json. This will contain Array of Pizza objects containing id,name,ingredients.
     
     "id": 1,
     "name": "Capricciosa",
     "ingredients": [
      "tomato sauce", "mozzarella", "mushrooms", "ham", "olives"
    ]
    In get-pizzas.js : we added a route '/' that returns a static message 'Welcome to Pizza API'. If Pizza Id is not passed, it will return the full Pizza list. If Id is passed, we use Array.find method, which searches for a pizza by the pizza ID from your pizza list. 
    If it finds a pizza, return it as a handler result. If there aren’t any pizzas with that ID, have your application throw an error.
    We will then import get-pizzas.js in api.js from the handler directory. use < claudia update > to add the code to your existing Lambda function along with its API Gateway routes.
    
    test:
    use the API URL and append the /pizzas/1 to it to find pizza by id.
    
    createOrder function handler: It accept some order data or an order object. we created route /orders with Post method in app.js and import the create-order.js file. We pass customized statuses for both success and error: 201 (successful request)and 400, respectively.
    The body of the POST request is automatically parsed by API Gateway. available in the request.body attribute, which means that no need to use any additional middleware to parse the received data, such as the Express.js body_parser.
   
   Test:
   curl -i \     
  -H "Content-Type: application/json" \    
  -X POST \    
  -d '{"pizzaId":1,"address":"221B Baker Street"}' \    
  <url>/orders    
    
for persistance, we will be using dynamodb. We first define a table name; in your case, it will be pizza-orders. Then you need to define attributes. DynamoDB requires only primary key definition. 
    orderId - primary key ; 
    type string. 
    
aws dynamodb create-table --table-name pizza-orders \    
  --attribute-definitions AttributeName=orderId,AttributeType=S \     
  --key-schema AttributeName=orderId,KeyType=HASH \    
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \     
  --region eu-central-1 \   
  --query TableDescription.TableArn --output text    
  
  this will create the table and return an ARN.
  
  Connecting '/order' api with dynamodb table:
      we first import AWS SDK and then initialize dynamodb documentClient. The createOrder function sends the order data to dynamodb table and receives a confirmation that order is saved successfully. After confimation, handler passes the success value to Claudia API builder which in turn transfer it to the user via Api gateway.
      
DocumentClient.put method puts a new item in the database, either by creating a new one or replacing an existing item with the same ID.

test:
aws dynamodb scan \    
  --table-name pizza-orders \   
  --region us-east-1 \
  --output json   
  
curl -i \
  -H "Content-Type: application/json" \
  <url>/orders
