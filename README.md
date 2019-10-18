# Claudia

In a serverless application, your requests are processed with an API router layer that has only one job: it accepts HTTP requests and routes them to the underlying business layer services. The API router in a serverless architecture is always independently managed. That means that application developers don’t maintain the API router, and it’s scaled automatically by the serverless provider to accept all the HTTP requests your API is receiving. Also, you pay only for the requests that are processed.

Claudia is a Node.js library that eases the deployment of Node.js projects to AWS Lambda and API Gateway. It automates all the error-prone deployment and configuration tasks and sets everything up the way JavaScript developers expect out of the box.

Rather than replacing the AWS SDK, Claudia is built on top of it, and it automates most common workflows with a single command.

In this application, requests are accepted by API Gateway. After the requests are parsed, then it take the help of Claudia API Builder to do internal routing. This is done to differentiate internal actions the is needed next. Since we are using single lambda to implement all our functions, we have to do the steps mentioned above to differentiate internal actions. Based on the received request, Claudia API builder will invoke corresponding handler. After the requests are processed, a response is returned to the user which passes through both Claudia API builder and API gateway before reaching the user.

In apib11.js, I created a GET pizza service route that lists all available pizzas. First I imported Claudia API builder module. Then I create an instance of it and exportit. 
route '/pizzas' :  list of all pizzas.

deployment:
claudia create \  
  --region us-east-1 \ 
  --api-module apib11.js

Claudia will create a claudia.json file in the root of your project for its internal use. This file contains the base url for testing your route by copying the url and paste it in the browser. Make sure to append your route to the base URL
  
Folder structure:
     Folder called handlers in the project root has a get-pizzas.js file inside it. This contains the getPizzas handler.

     Folder in the root of Pizza API project called data contains a file called pizzas.json. This will contain Array of Pizza objects containing id,name,ingredients.
     
     "id": 1,
     "name": "Capricciosa",
     "ingredients": [
      "tomato sauce", "mozzarella", "mushrooms", "ham", "olives"
    ]
    In get-pizzas.js : I added a route '/' that returns a static message 'Welcome to Pizza API'. If Pizza Id is not passed, it will return the full Pizza list. If Id is passed, Array.find method is used that searches for a pizza by the pizza ID from the pizza list. If it finds a pizza, return it as a handler result. If there aren’t any pizzas with that ID, it will throw an error.
    I then imported get-pizzas.js in api.js.I used "claudia update" command  to update lambda function along with its API Gateway route.
    
    test:
    <API URL>/pizzas/1 route to find pizza by id.
    
    createOrder function handler: It accept order data or an order object. I created route 
    /orders with Post method in app.js and imported it to the create-order.js file. I then pass customized statuses for both success and error: 201 (successful request)and 400, respectively.
    The body of the POST request is automatically parsed by API Gateway available in the request.body attribute, which means that no need to use any additional middleware such as the Express.js body_parser to parse the received data.
   
   Test:
              curl -i \     
              -H "Content-Type: application/json" \    
              -X POST \    
              -d '{"pizzaId":1,"address":"221B Baker Street"}' \    
              <url>/orders    
      
for persistance, I am using dynamodb. I first defined a table name pizza-orders. Then I defined attributes. DynamoDB requires only primary key definition. 
    orderId - primary key ; 
    type string. 
    
    command: This will create the table and return an ARN. 
            
            aws dynamodb create-table --table-name pizza-orders \    
            --attribute-definitions AttributeName=orderId,AttributeType=S \     
            --key-schema AttributeName=orderId,KeyType=HASH \    
            --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 \     
            --region eu-central-1 \   
            --query TableDescription.TableArn --output text    
  
  
  
    To connect '/order' api with dynamodb table:
        first I imported AWS SDK and then initialized dynamodb documentClient. The createOrder function sends the order data to dynamodb table and receives a confirmation that order is saved successfully. After confimation, handler passes the success value to Claudia API builder which in turn transfer it to the user via Api gateway.
        
DocumentClient.put method puts a new item in the database, either by creating a new one or replacing an existing item with the same ID.

        test:
        aws dynamodb scan \    
          --table-name pizza-orders \   
          --region us-east-1 \
          --output json   
          
        curl -i \
          -H "Content-Type: application/json" \
          <url>/orders
