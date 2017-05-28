# Alzheimer Buddy

Alzheimer Buddy is an application for alzheimer patients to help in their day to day activities. Over 5.3 million people in the US are affected by the alzheimer disease. This application is just a step towards helping them in their daily activities. 

The basic idea of this application is that we have implemented an Alexa voice assistant skill that will help the patient with the information the patient needs. The Alexa skill is a voice assistant that uses Alexa voice service to communicate with the patient. 

The application is built completely on Amazon Web Services. The services used are - 
1. Amazon Developer Portal - This service is used to create and manipulate the custom Alexa skill. 
2. AWS Lambda - This serves as the backend of the application.  
3. AWS Relational Database Service - This is the database of the application. 
4. AWS Beanstalk - The web application is hosted on Amazon Beanstalk for accessibility.


The application architecture includes a web application that is controlled by a member of the patients family who can add/update any information. The Alexa skill helps in communicating this information with the patient. The information that is updated by the member of the family is stored on an AWS Relational Database Service. The Alexa Skill is implemented on the Amazon Developer Portal. The interaction model, sample utterances, custom slots and everthing else related to the custom Alexa skill is implemented on the Amazon Developer Portal. 

The queries are handled by a Lambda application on AWS. The endpoint of this Lambda application is mentioned in the skill so that whenever the patient queries the skill, it identifies the kind of query and directs it with metadata to the Lambda service. THe AWS Lambda service communicates with the database on AWS Relational Database Service and appropriately returns a response which is then returned by the Alexa skill. 

The architecture of the entire application -
![alt text](https://github.com/kevallakhani95/AlzheimerBuddy/blob/master/image1.jpeg)

THe various kinds of information that the patient can query for are - 
1. Location of objects - For eg. Wallet, Keys and more. The patient can also add or update an object if he wants to by merely communicating with the voice service. 
2. Family information - For eg. Brother, Sister and more. The patient can ask for information regarding his/her family members (by name or by relation).
3. Memories - The patient can ask for any memory related to any person in the database or even just ask for a memory and the application will return a random memory from the database. 
4. Schedule - He/She can even ask for his or her schedule and the service will return the next thing on his/her schedule.

We have also implemented an extra feature where the family member who is looking over the patients shoulder will be able to track the patients health, his state and more. The dashboard page of the application shows various information about the patient like recent requests, number of requests and more. 

Also, for simplicity the patient can communicate with the skill and get access to it using any application that supports Alexa skills. The application is designed in a such a way that the login credentials used to login to the web application will also be used to login to the application that the patient uses. ALso, we can integrate a smart watch that is connected to the Amazon Echo and can be used by the patient to communicate. 

For a better understanding of the application please watch this video - 
https://www.youtube.com/watch?v=5t366jxY2Xo


It is a step towards making the patients life easier and track their health over time!
