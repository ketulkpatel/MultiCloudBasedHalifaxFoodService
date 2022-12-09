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

user_details_table_name='Users'
user_details_table = dynamo_db.Table(user_details_table_name)

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
  
def encryptMessage(message, keyword):
  matrix = createEncMatrix(len(keyword), message)
  keywordSequence = getKeywordSequence(keyword)

  ciphertext = "";
  for num in range(len(keywordSequence)):
    pos = keywordSequence.index(num+1)
    for row in range(len(matrix)):
      if len(matrix[row]) > pos:
        ciphertext += matrix[row][pos]
  return ciphertext


def createEncMatrix(width, message):
  r = 0
  c = 0
  matrix = [[]]
  for pos, ch in enumerate(message):
    matrix[r].append(ch)
    c += 1
    if c >= width:
      c = 0
      r += 1
      matrix.append([])

  return matrix


def getKeywordSequence(keyword):
  sequence = []
  for pos, ch in enumerate(keyword):
    previousLetters = keyword[:pos]
    newNumber = 1
    for previousPos, previousCh in enumerate(previousLetters):
      if previousCh > ch:
        sequence[previousPos] += 1
      else:
        newNumber += 1
    sequence.append(newNumber)
  return sequence    


def lambda_handler(event, context):
    try:
        body_json = json.loads(event['body'])
        
        email = body_json['email']
        operation = body_json['operation']
        
        if operation == "LOGIN":
            result = user_plain_text_table.scan(FilterExpression=Attr('EmailID').eq(email))
            
            if result['Count'] == 0:
              response = make_response(False,"Email address does not exist.", None)
            
            else:
              key = result['Items'][0]['Key']
              plain_text = result['Items'][0]['PlainText']
              actual_cipher_text = encryptMessage(plain_text, key)
              provided_cipher_text = body_json['cipherText']
                          
                          
              if actual_cipher_text == provided_cipher_text:
                user = user_details_table.scan(FilterExpression=Attr('EmailID').eq(email))

                role = user['Items'][0]['Role']
                user_data = {
                  "user": user
                }
                login_day = body_json['loginDate']
                login_month = body_json['loginMonth']
                login_year = body_json['loginYear']
                role = user['Items'][0]['Role']
                gc = gspread.service_account(filename='google_service_account_credentials.json')
                gsheet = gc.open("UserLoginDetails")
                row = [email, login_day, login_month, login_year, role]
                gsheet.sheet1.insert_row(row, index=2)
                
                
                
                response = make_response(True,"SUCESS", user_data)
                
              else:
                response = make_response(False,"Given text is incorrect. Please try again.!", None)
        
        else:
          key = body_json['key']
          plain_text = body_json['plainText']
          user_plain_text_table.put_item(Item={"EmailID": email, "Key": key, "PlainText": plain_text})
          cipher_text = encryptMessage(plain_text, key)
          response = make_response(True,"SUCESS",cipher_text)
        
    except Exception as e:
        response = make_response(False,str(e), None)
    
    logging.info(response)
    return response

