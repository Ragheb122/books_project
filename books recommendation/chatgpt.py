from flask import Flask, request, jsonify, render_template
import openai
import requests
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

    # arr = [('Wild Animus',1), ('Timeline',2), ('To Kill a Mockingbird',3),
    #        ('Harry Potter and the Sorcerers Stone (Harry Potter (Paperback))',4)
# ]

# Set up OpenAI API credentials
openai.api_key = ''

# Define a route for the root URL
@app.route('/')
def index():
    return render_template('page.html')

# Define a route for generating the book description


@app.route('/generate-description', methods=['POST'])
def generate_description():
    response = requests.get('http://localhost:1338/posts')

    if response.status_code == 200:
        data = response.json()
        arr = []
        if data.get('code') == 200:
            # Your code here if the code is 200
            for post in data['Data']:
                arr.append((post['title'], post['id']))
    # Get the user input from the request
    user_input = request.json['userInput']
    if user_input.strip() != "":
        # Generating chat response
        response = openai.Completion.create(
            engine='text-davinci-003',
            prompt=f'the following array has tuples of books names with thier ids,return the name and then a summary of most relevant book from this array: {arr} according to this description: {user_input},\n and then write this link http://localhost:3000/book/id where id is book\'s id, return in this syntax:"the name of the book is: book\'s name, summary: summary of the book and then the link of the book in out site is: link"',
            max_tokens=500,
            temperature=0.7,
            n=1,
            stop=None
        )
        # Extracting the description from the chat response
        description = response.choices[0].text.strip()
        print(description)
        # Return the generated description as a JSON response
        print(jsonify({'description': description}))
    else:
        description = "please insert input"
    return jsonify({'description': description})

arr_messages=[]
@app.route('/messages', methods=['GET'])
def handle_request():
    arg1 = request.args.get('arg1')
    response = requests.get(f'http://localhost:1338/default/getmessagesperuser?token={arg1}')

    # Process the arguments as needed
    if response.status_code == 200:
        data = response.json()
        if data.get('code') == 200:
            # Your code here if the code is 200
            for message in data['Data']:
                arr_messages.append(message['message'])
        return jsonify({'arr': arr_messages})  # Return arr as JSON response
    else:
        return jsonify({'arr': []})  # Return an empty array as JSON response
@app.route('/generateBook', methods=['POST'])
def generate_book():
    response = requests.get('http://localhost:1338/posts')
    if response.status_code == 200:
        data = response.json()
        arr = []
        if data.get('code') == 200:
            # Your code here if the code is 200
            for post in data['Data']:
                arr.append((post['title'], post['id']))
    # Get the user input from the request
        # Generating chat response
    response = openai.Completion.create(
        engine='text-davinci-003',
        prompt=f'the following array has messages of user, suggest most relevant book according to these messages :{arr_messages}, the book you recommend must be from the'
             f'the following array that has tuples of books names with thier ids,return the name and then a summary of most relevant book from this array: {arr},\n and then write this link http://localhost:3000/book/id where id is book\'s id, return in this syntax:"the name of the book is: book\'s name, summary: summary of the book and then the link of the book in out site is: link"',
        max_tokens=500,
        temperature=0.7,
        n=1,
        stop=None
    )
    # Extracting the description from the chat response
    description = response.choices[0].text.strip()
    print(description)
    # Return the generated description as a JSON response
    print(jsonify({'description': description}))
    return jsonify({'description': description})

if __name__ == '__main__':
    app.run()
