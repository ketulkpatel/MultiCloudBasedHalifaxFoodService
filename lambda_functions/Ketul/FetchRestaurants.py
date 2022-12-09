import json
import boto3
import logging
import math

from boto3.dynamodb.conditions import Attr


# Reference: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.query
dynamo_db = boto3.resource('dynamodb')
table_name='Users'
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
        result = table.scan(FilterExpression=Attr('Role').eq("restaurant"))
        response = make_response(True, "SUCESS", result)
    except Exception as e:
        response = make_response(False, str(e), None)
        
    logger.info(response)
    return response