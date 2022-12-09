import json
import boto3
import logging
from boto3.dynamodb.conditions import Attr

# Reference: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/dynamodb.html#DynamoDB.Client.query
dynamo_db = boto3.resource('dynamodb')
table_name='Users'
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
    email = body_json['email']
    name = body_json['name']
    phone_number = body_json['phoneNumber']
    role = body_json['role']
    address = body_json['address']

    try:
        table.put_item(Item={"EmailID": email, "Name": name, "PhoneNumber": phone_number, "Role": role, "Address": address})
        response = make_response(True,"SUCESS")
    except Exception as e:
        response = make_response(False,str(e))
    
    logging.info(response)
    return response

    
    
