from flask import Flask, request, jsonify, render_template
import openai
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

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
        prompt='Give me a name of a famous book about:' + user_input + '\nwith a short description and a link to it in amazon.',
        max_tokens=200,
        temperature=0.7,
        n=1,
        stop=None
    )

    # Extracting the description from the chat response
    description = response.choices[0].text.strip()

    # Return the generated description as a JSON response
    return jsonify({'description': description})

if __name__ == '__main__':
    app.run()
