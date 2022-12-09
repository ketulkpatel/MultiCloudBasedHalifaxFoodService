import json
import boto3
import uuid
import logging 
import urllib3
from boto3.dynamodb.conditions import Key, Attr
client = boto3.client('dynamodb') 
intent=""
result = {}

logger = logging.getLogger() 
logger.setLevel(logging.DEBUG)

dyn_client = boto3.resource('dynamodb')
RATING_TABLE_NAME="AddRatingTable"
rating_table = dyn_client.Table(RATING_TABLE_NAME)
RECIPE_TABLE_NAME="AddRecipeTable"
recipe_table = dyn_client.Table(RECIPE_TABLE_NAME)
COMPLAINTS_TABLE= "RestaurantOwnerDetails"
complaints_table=dyn_client.Table(COMPLAINTS_TABLE)

def verifyUserInformation(userIdFromBot,orderNumberFromBot):
    responseFromDB = client.get_item(
            TableName='UserDetails',
            Key={
                'uid': {
                    'S': userIdFromBot,
                }
            }
            )
    key='Item'
    value = key in responseFromDB.keys()
    if value:
        userIdDB=responseFromDB['Item']['uid']['S']
        orderNumberDB=responseFromDB['Item']['order_number']['N']
        
        message=""
        if (userIdDB.__eq__(userIdFromBot) and orderNumberDB.__eq__(orderNumberFromBot)):
            message = "Your details are verified. You can now give the order rating!"
        else:
            print("inside else of match if ")
            message = "Your details couldn't be verified: name did not match with the information provided"
        global result
        # Result to lex bot
        result = {
                    "sessionState": {
                        "dialogAction": {
                            "type": "Close"
                        },
                        "intent": {
                            'name':intent,
                            'slots': slots,
                            'state':'Fulfilled'
                        }
                    },
                    "messages": [
                        {
                            "contentType": "PlainText",
                            "content": message
                        }
                    ]
                }
        return result
    else:
        message="Sorry I can't find your details in our records : email does not exists in our database"
        result =  {
                    "sessionState": {
                        "dialogAction": {
                            "type": "Close"
                        },
                        "intent": {
                            'name':intent,
                            'slots': slots,
                            'state':'Fulfilled'
                        }
                    },
                    "messages": [
                        {
                            "contentType": "PlainText",
                            "content": message
                        }
                    ]
                }
        return result

def verifyRestaurantOwnerInformation(restEmailFromBot,restNameFromBot):
    responseFromDB = client.get_item(
            TableName='RestaurantOwnerDetails',
            Key={
                'restOwner_email': {
                    'S': restEmailFromBot,
                }
            }
            )
    key='Item'
    value = key in responseFromDB.keys()
    if value:
        restOwnerNameDB=responseFromDB['Item']['restOwner_name']['S']
        restOwnerEmailDB=responseFromDB['Item']['restOwner_email']['S']
        
        message=""
        if (restOwnerEmailDB.__eq__(restEmailFromBot) and restOwnerNameDB.__eq__(restNameFromBot)):
            message = "Your details are verified. Now you can add recipes and its price!!"
        else:
            print("inside else of match if ")
            message = "Your details couldn't be verified: name did not match with the information provided"
        global result
    # Result to lex bot
        result = {
                    "sessionState": {
                        "dialogAction": {
                            "type": "Close"
                        },
                        "intent": {
                            'name':intent,
                            'slots': slots,
                            'state':'Fulfilled'
                        }
                    },
                    "messages": [
                        {
                            "contentType": "PlainText",
                            "content": message
                        }
                    ]
                }
        return result
    else:
        message="Sorry I can't find your details in our records : email does not exists in our database"
        result =  {
                    "sessionState": {
                        "dialogAction": {
                            "type": "Close"
                        },
                        "intent": {
                            'name':intent,
                            'slots': slots,
                            'state':'Fulfilled'
                        }
                    },
                    "messages": [
                        {
                            "contentType": "PlainText",
                            "content": message
                        }
                    ]
                }
        return result

def verifyOrderInformation(userIdFromBot,orderIdFromBot):
    responseFromDB = client.get_item(
            TableName='TrackingOrderDetails',
            Key={
                'user_id': {
                    'S': userIdFromBot,
                }
            }
            )
    key='Item'
    value = key in responseFromDB.keys()
    if value:
        userIdDB=responseFromDB['Item']['user_id']['S']
        orderIdDB=responseFromDB['Item']['order_id']['S']
        orderStatusDB=responseFromDB['Item']['order_status']['S']
        userNameDB=responseFromDB['Item']['user_name']['S']
        
        message=""
        if (userIdDB.__eq__(userIdFromBot) and orderIdDB.__eq__(orderIdFromBot)):
            message = "Your details are verified." +userNameDB+"'s order status is: " +orderStatusDB
        else:
            print("inside else of match if ")
            message = "Your details couldn't be verified: name did not match with the information provided"
        global result
        # Result to lex bot
        result = {
                    "sessionState": {
                        "dialogAction": {
                            "type": "Close"
                        },
                        "intent": {
                            'name':intent,
                            'slots': slots,
                            'state':'Fulfilled'
                        }
                    },
                    "messages": [
                        {
                            "contentType": "PlainText",
                            "content": message
                        }
                    ]
                }
        return result
# Adding add rate function 
#------Functions----------#
def safe_int(n):
    if n is not None:
        return int(n)
    return n
    
def try_ex(func):
    try:
        return func()
    except keyError:
        return None

def elicit_slot(session_attributes, intent, slots, slot_to_elicit, message):
    return {
        'sessionAttributes': session_attributes,
        'dialogAction':{
            'type': 'ElicitSlot',
            'intentName': intent,
            'slots': slots,
            'slotToElicit': slot_to_elicit,
            'message': message
        }
    }
    
def confirm_intent(session_attributes, intent, slots, message):
    return{
        'sessionAttributes': session_attributes,
        'dialogAction':{
            'type': 'ConfirmIntent',
            'intentName': intent,
            'slots': slots,
            'message': message
        }
    }
    
    
def close(intent_request, message):
    return {
                "sessionState": {
            		    "dialogAction": {
            		      "type": "Close"
            		    },
            		    "intent": {
            		      "name": intent_request['sessionState']['intent']['name'],
            			  "state": "Fulfilled"
            		    }
            		  },
            		  "messages": [
            	       {
            	         "contentType": "PlainText",
            	         "content": message
            	        }
            	    ]
                }
def delegate(session_attributes, slots):
    return{
        'sessionAttributes': session_attributes,
        'dialogAction':{
            'type': 'Delegate',
            'slots': slots
        }
    }

def save_rating(first_name,order_num, order_rating):
    customer_id = uuid.uuid4().hex
    res = rating_table.put_item(
                Item={
                  'customer_id': customer_id,    
                  'first_name' :first_name,
                  'order_number' : order_num,
                  'rating':order_rating
                  
                })
    console.log(res)
def validate_rating(slots):
    first_name = try_ex(lambda: slots['FirstName'])
    order_num = try_ex(lambda: slots['order_number'])
    order_rating = safe_int(try_ex(lambda: slots['rating']))
    
    
    if order_rating is not None and (order_rating < 1 or order_rating > 10):
        return build_validation_result(
            False,
            'rating',
            'rating must be 1 to 10'
        )
    return {'isValid': True}

def build_validation_result(isValid, violated_slot, message_content):
    return{
        'isValid': isValid,
        'violatedSlot': violated_slot,
        'message':{ 
            'contentType': 'PlainText',
            'content': message_content
        } 
        
    }
def take_rating(intent_request):
    slots = intent_request['sessionState']['intent']['slots']
    first_name = slots['FirstName']["value"]["interpretedValue"]
    order_num = slots['order_number']["value"]["interpretedValue"]
    order_rating = slots['rating']["value"]["interpretedValue"]
    
    intent = intent_request['sessionState']['intent']
    
    session_attributes = {}
    session_attributes['sessionId'] = intent_request['sessionId']
    
    #session_attributes = intent_request['sessionAttributes'] if intent_request['sessionAttributes'] is not None else{}
    active_contexts = {}
    intent = intent_request['sessionState']['intent']
    #logger.debug(intent_request['invocationSource'])
    
    if intent_request['invocationSource'] == 'DialogCodeHook':
        
        validation_result = validate_rating(intent_request['sessionState']['intent']['slots'])
        #logger.debug(validation_result)
        
        if not validation_result['isValid']:
            slots[validation_result['violatedSlot']] = None
            return elicit_slot(
                session_attributes,
                intent,
                slots,
                validation_result['violatedSlot'],
                validation_result['message']
            )
        return delegate(session_attributes, intent_request['sessionState']['intent']['slots'])
    
    save_rating(first_name, order_num, order_rating)
    return close(intent_request, "YOUR RATING HAS BEEN ADDED SUCCESSFULLY")
# End of add recipe function

# Start of the add food recipe
def save_recipe(foodRecipe_name, foodRecipe_rating, foodRecipe_cost,foodRecipe_type):
    recipe_id = uuid.uuid4().hex
    logger.debug(foodRecipe_type)
    logger.debug(recipe_id)
    
    res = recipe_table.put_item(
                Item={
                  'recipe_id': recipe_id,    
                  'recipe_name' :foodRecipe_name,
                  'recipe_rating':foodRecipe_rating,
                  'recipe_cost' : foodRecipe_cost,
                  'recipe_type' : foodRecipe_type
                })
def isValid_recipe_type(foodRecipe_type):
    recipe_types = ['Vegetarian', 'NonVegetarian']
    if foodRecipe_type in recipe_types:
        return true
    return false

def validate_recipe(slots):
    foodRecipe_name = try_ex(lambda: slots['recipe_name'])
    foodRecipe_rating = safe_int(try_ex(lambda: slots['recipe_rating']))
    foodRecipe_cost= try_ex(lambda: slots['recipe_cost'])
    foodRecipe_type = try_ex(lambda: slots['recipe_type'])
    
    if foodRecipe_rating is not None and (foodRecipe_ratingorder_rating < 1 or foodRecipe_rating > 10):
        return build_validation_result(
            False,
            'rating',
            'rating must be 1 to 10'
        )
    
    if foodRecipe_type and not isvalid_recipe_type(foodRecipe_type):
        return build_validation_result(
            False,
            'recipe_type',
            'I did not recognize that recipe type what recipe type do you want')
    return {'isValid': True}

def take_recipe(intent_request):
    slots = intent_request['sessionState']['intent']['slots']
    foodRecipe_name = slots["recipe_name"]["value"]["interpretedValue"]
    foodRecipe_cost = slots['recipe_cost']["value"]["interpretedValue"]
    foodRecipe_rating = slots['recipe_rating']["value"]["interpretedValue"]
    foodRecipe_type = slots['recipe_type']["value"]["interpretedValue"]
    
    intent = intent_request['sessionState']['intent']
    
    session_attributes = {}
    session_attributes['sessionId'] = intent_request['sessionId']
    # session_attributes = intent_request['sessionState']['sessionAttributes'] if intent_request['sessionState']['sessionAttributes'] is not None else{}
    active_contexts = {}
    intent = intent_request['sessionState']['intent']
    if intent_request['invocationSource'] == 'DialogCodeHook':
        
        validation_result = validate_recipe(intent_request['sessionState']['intent']['slots'])
        if not validation_result['isValid']:
            slots[validation_result['violatedSlot']] = None
            return elicit_slot(
                session_attributes,
                event['sessionState']['intent']['name'],
                slots,
                validation_result['violatedSlot'],
                validation_result['message']
            )
        return delegate(session_attributes, intent_request['sessionState']['intent']['slots'])
    logger.debug(foodRecipe_name)
    logger.debug(foodRecipe_cost)
    logger.debug(foodRecipe_rating)
    logger.debug(foodRecipe_type)

    save_recipe(foodRecipe_name, foodRecipe_cost, foodRecipe_rating, foodRecipe_type)
    
    return close(intent_request, "YOUR RECIPE HAS BEEN ADDED SUCCESSFULLY")
# End of the add food recipe
# Start of the customer complaints
def lambda_handler(event, context):
    global intent

    intent=event['sessionState']['intent']['name'] 
    global slots
    
    if event['invocationSource'] == 'FulfillmentCodeHook':
        slots=event['sessionState']['intent']['slots']
        userID=slots['user_id']['value']['originalValue']
        print(userID)
        orderNumber=slots['order_number']['value']['originalValue']
        print(orderNumber)
        if intent=='VerifyUser':
            
            verifyUserInformation(userID,orderNumber)
            print(result)
            return result
            
def verifyUserInformation(userIdFromBot,orderNumberFromBot):
    responseFromDB = client.get_item(
            TableName='UserDetails',
            Key={
                'uid': {
                    'S': userIdFromBot,
                }
            }
            )
    key='Item'
# End of the customer complaints

def lambda_handler(event, context):
    global intent
    intent=event['sessionState']['intent']['name'] 
    global slots
    global result
    if intent=='VerifyUser':
        if event['invocationSource'] == 'FulfillmentCodeHook':
            slots=event['sessionState']['intent']['slots']
            userID=slots['user_id']['value']['originalValue']
            print(userID)
            orderNumber=slots['order_number']['value']['originalValue']
            print(orderNumber)
            # if intent=='VerifyUser':
            verifyUserInformation(userID,orderNumber)
            print(result)
            return result
            
    if intent=='VerifyRestaurantOwner':
        if event['invocationSource'] == 'FulfillmentCodeHook':
            slots=event['sessionState']['intent']['slots']
            restOwnerEmail=slots['restaurantOwner_email']['value']['originalValue']
            print(restOwnerEmail)
            restOwnerName=slots['restaurantOwner_name']['value']['originalValue']
            print(restOwnerName)
            # if intent=='VerifyRestaurantOwner':
            verifyRestaurantOwnerInformation(restOwnerEmail,restOwnerName)
            print(result)
            return result
            
    if intent=='TrackFoodOrder':
        if event['invocationSource'] == 'FulfillmentCodeHook':
            slots=event['sessionState']['intent']['slots']
            userID=slots['user_id']['value']['originalValue']
            print(userID)
            orderID=slots['order_id']['value']['originalValue']
            print(orderID)
            if intent=='TrackFoodOrder':
                verifyOrderInformation(userID,orderID)
                print(result)
                return result
                
    if intent == 'AddOrderRating':
        return take_rating(event)
    if intent == 'AddFoodRecipe':
        return take_recipe(event)
    if intent =='CustomerComplaints':
       
        chatRoomid =  uuid.uuid4().hex
        if event['invocationSource'] == 'FulfillmentCodeHook':
            slots=event['sessionState']['intent']['slots']
            restaurant_name=slots['restaurant_name']['value']['originalValue']
            print(restaurant_name)
            customer_id=slots['customer_id']['value']['originalValue']
            complaints=slots['complaints']['value']['originalValue']
            response = complaints_table.scan(FilterExpression=Attr("restaurant_name").eq(restaurant_name))
            print(response)
            data = response['Items'][0]['restOwner_email']
            print("this is data")
            print(data)
            jsonMsg = {"uuid":chatRoomid,"restaurant":data,"customer":customer_id, "complaint_string":complaints}
            print(jsonMsg)
            http = urllib3.PoolManager()
 
            url = 'https://olrrhz2x6gqx5fkef4u62e4ub40fgapk.lambda-url.us-east-1.on.aws/'
            myobj = {'somekey': 'somevalue'}
   
            response = http.request('POST',
                                url,
                                body = json.dumps(jsonMsg),
                                headers = {'Content-Type': 'application/json'},
                                retries = False)
            print(response)
        
            result = {
                    "sessionState": { 
                        "dialogAction": {
                            "type": "Close"
                        },
                        "intent": {
                            'name':intent,
                            'slots': slots,
                            'state':'Fulfilled'
                        }
                    },
                    "messages": [
                        {
                            "contentType": "PlainText",
                            "content":"Your chatroom id is:" +chatRoomid
                        }
                    ]
                }
        return result
 
# # Lambda Code Reference:
#  https://github.com/venkateshkodumuri/Lex_Chatbot_to_fetch_data_from_dynamodb/blob/main/lambda_function.py
#  https://github.com/PradipNichite/Youtube-Tutorials/blob/main/Amazon_Lex/Part2.py
#  https://github.com/fireship-io/react-firebase-chat/blob/master/src/App.js
#  https://www.youtube.com/watch?v=zQyrwxMPm88