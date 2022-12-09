import json
import boto3
import logging
import math

from boto3.dynamodb.conditions import Attr


# Reference: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.query
dynamo_db = boto3.resource('dynamodb')
table_name='Recipes'
table = dynamo_db.Table(table_name)

# Reference: https://realpython.com/python-logging/
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


def make_response(status, message, data):
    return {
        "body": {
        "status" : status,
        "message" : message,
        "data": data
        }
    }
    
def lambda_handler(event, context):

    try:
        body_json = json.loads(event['body'])
        veg_confidence = body_json['veg_confidence']
        nonveg_Confidence = body_json['nonveg_Confidence']
        restaurant_id = body_json['RestaurantID']
        recipe_id = body_json['RecipeID']

        
        if veg_confidence > nonveg_Confidence:
            recipe_type = "Vegetarian"
        else:
            recipe_type = "NonVegetarian"

        result = table.scan(FilterExpression= Attr('RestaurantID').eq(restaurant_id) and Attr('RecipeType').eq(recipe_type))
        response = make_response(True, "SUCESS", result)
    except Exception as e:
        response = make_response(False, str(e), None)
        
    logger.info(response)
    return response