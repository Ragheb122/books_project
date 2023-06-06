from flask import Flask, request, jsonify, render_template
import openai
import requests
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)


response = requests.get('http://localhost:1338/posts')

if response.status_code == 200:
    data = response.json()
    arr = []
    if data.get('code') == 200:
        # Your code here if the code is 200
        for post in data['Data']:
            arr.append((post['title'], post['id']))
    arr = [('Wild Animus',1), ('Timeline',2), ('To Kill a Mockingbird',3),
           ('Harry Potter and the Sorcerers Stone (Harry Potter (Paperback))',4)
]

# Set up OpenAI API credentials
openai.api_key = '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'

# Define a route for the root URL
@app.route('/')
def index():
    return render_template('page.html')

# Define a route for generating the book description
@app.route('/generate-description', methods=['POST'])
def generate_description():
    # Get the user input from the request
    user_input = request.json['userInput']

    # Generating chat response
    response = openai.Completion.create(
        engine='text-davinci-003',
        prompt=f'the following array has tuples of books names with thier ids,return the name of most relevant book from this array: {arr} according to this description: {user_input},\n in addition write this link http://localhost:3000/book/id where id is the books id, return only the name and link in this syntax:"the name of the book is: name, the link of the book in out site is: link"',
        max_tokens=200,
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
