import json
import boto3
import logging
from boto3.dynamodb.conditions import Attr
import uuid

# Reference: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.query
dynamo_db = boto3.resource('dynamodb')
table_name='CustomerFeedback'
table = dynamo_db.Table(table_name)

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
    
    body_json = json.loads(event['body'])
    restaurant_id = body_json['RestaurantID']
    feedback = body_json['Feedback']
    customer_id = body_json['CustomerID']

    try:
        table.put_item(Item={"ID": uuid.uuid4().hex,"CustomerID": customer_id, "Feedback": feedback, "RestaurantID": restaurant_id})
        response = make_response(True,"SUCESS")
    except Exception as e:
        response = make_response(False,str(e))
    
    logging.info(response)
    return response
