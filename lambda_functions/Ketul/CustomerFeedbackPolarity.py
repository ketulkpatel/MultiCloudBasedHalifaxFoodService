import json
import boto3
import gspread
import logging
import math

from boto3.dynamodb.conditions import Attr


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

def write_feedback_polarity_to_google_sheet(event):
    
    try:
        customers_feedback_polarity = []
        body_json = json.loads(event['body'])
        restaurant_id = body_json['RestaurantID']
    
        result = table.scan(FilterExpression=Attr('RestaurantID').eq(restaurant_id))
        
        if result['Count'] == 0:
            response = make_response(True,"Customers yet to provide feedback.")
            
        else:
            
            comprehend = boto3.client("comprehend")
            
            for i in range(result['Count']):
                
                individaul_feedback_polarity = {}
    
                customer_id = result['Items'][i]['CustomerID']
                feedback = result['Items'][i]['Feedback']
                
                sentiment_result= comprehend.detect_sentiment(Text = feedback, LanguageCode = "en")
                polarity = sentiment_result['Sentiment']
                
                individaul_feedback_polarity['Feedback'] = feedback
                individaul_feedback_polarity['Polarity'] = polarity
                individaul_feedback_polarity['CustomerID'] = customer_id
                
                
                customers_feedback_polarity.append(individaul_feedback_polarity)
                
        
        gc = gspread.service_account(filename='google_service_account_credentials.json')
        gsheet = gc.open("CustomerFeedbacks")
        
        gsheet.sheet1.clear()
        headers = ['CustomerID', 'Feedback', 'Polarity']
        gsheet.sheet1.insert_row(headers, index=1)
        
        for j in customers_feedback_polarity:
            row = [
                j['CustomerID'], 
                j['Feedback'], 
                j['Polarity']
            ]
            
            gsheet.sheet1.insert_row(row, index=2)
            
        response = make_response(True, "SUCCESS")
        
    except Exception as e:
        response = make_response(False, str(e))
        
    return response


def lambda_handler(event, context):
    final_response = write_feedback_polarity_to_google_sheet(event)
    logger.info(final_response)
    return final_response