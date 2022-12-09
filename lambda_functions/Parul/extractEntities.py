import json
import boto3
import pprint
import re

dynamodb = boto3.client('dynamodb')

filename = ""
def lambda_handler(event, context):
    #get the file name from the request 
    global filename
    print(event)
    filename = json.loads(event['body'])['key1']
    restaurant_id = json.loads(event['body'])['key2']
    # filename="NUT COOKIES.txt"
    # restaurant_id="abc@gmail.com"
    
    #get the file data from s3 bucket
    s3=boto3.client('s3')
    bucket = "recipes-bucket"
    file = s3.get_object(Bucket=bucket,Key=filename)
    #content from file
    content = str(file['Body'].read())
    
    comprehend = boto3.client('comprehend')
    extracted_data = comprehend.detect_key_phrases(Text = content, LanguageCode = "en")
    key_phrases=extracted_data['KeyPhrases']
    textEntities = [dict_item['Text'] for dict_item in key_phrases]
    
    entityToString = " , ".join(textEntities)
    match_ent = re.findall(r'\b[A-Z]+(?:\s+[A-Z]+)*\b', entityToString)
    matched_entities = " , ".join(match_ent)
    print(match_ent)
    
    data = dynamodb.put_item(
    TableName='extract_recipes',
    Item={
        'recipe_name': {
          'S': filename
        },
        'restaurant_id':{
          'S' : restaurant_id
        },
        'entities': {
          'S': matched_entities
        }
    }
  )
  
    
    
    # TODO implement
    # return {
    #     'statusCode': 200,
    #     'body': json.dumps('Hello from Lambda!')
    # }
    
    response = {
      'statusCode': 200,
      'body': json.dumps('successfully created item!'),
      # 'headers': {
      #   'Content-Type': 'application/json',
      #   'Access-Control-Allow-Origin': '*'
      # },
    }
    
    return response
