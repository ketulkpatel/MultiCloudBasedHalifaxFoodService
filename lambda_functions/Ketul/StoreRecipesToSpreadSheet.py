import json
import boto3
import logging
from boto3.dynamodb.conditions import Attr
import math
import gspread

# Reference: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.query
dynamo_db = boto3.resource('dynamodb')
user_plain_text_table_name='UserKeyPlainText'
user_plain_text_table = dynamo_db.Table(user_plain_text_table_name)

recipe_table_name='Recipes'
recipe_table = dynamo_db.Table(recipe_table_name)

# Reference: https://realpython.com/python-logging/
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

def make_response(status, message):
    return {
        "body": {
        "status" : status,
        "message" : message
        }
    }


def lambda_handler(event, context):
    try:
        body_json = json.loads(event['body'])
        
        resaurant_id = body_json['RestaurantID']
    
    
        result = recipe_table.scan(FilterExpression=Attr('RestaurantID').eq(resaurant_id))
        
        if result['Count'] == 0:
            response = make_response(False, "No data found.")
            
        else:
            
            gc = gspread.service_account(filename='google_service_account_credentials.json')
            gsheet = gc.open("RecipeStatistics")
            gsheet.sheet1.clear()
            headers = ["RecipeName", "RecipePrice", "RecipeIngredients", "RecipeType", "RecipeRating"]
            gsheet.sheet1.insert_row(headers, index=1)
               
            
            for i in range(result['Count']):
                
    
                recipe_name = result['Items'][i]['RecipeName']
                recipe_type = result['Items'][i]['RecipeType']
                recipe_cost = result['Items'][i]['RecipePrice']
                recipe_rating = result['Items'][i]['RecipeRating']
                recipe_ingredients = result['Items'][i]['RecipeIngredients']
                
            
                row = [recipe_name, recipe_cost, recipe_ingredients, recipe_type, recipe_rating]
                gsheet.sheet1.insert_row(row, index=2)
                response = make_response(True, "SUCESS")
        
    except Exception as e:
        response = make_response(False,str(e))
    
    logging.info(response)
    return response

