import React, { useState , useEffect} from 'react';
// Layout
import Layout from "../../layout";
import "./searchBook.css";
import LoadingBooks from '../../components/LoadingBooks';

import cookie from "react-cookies";


function BookDescriptionGenerator() {
  const token = cookie.load("token");

  const [responseData, setResponseData] = useState(null);

  // State for user input
  const [userInput, setUserInput] = useState('');
  const [userInput2, setUserInput2] = useState('');

  // State for loading spinner visibility
  const [isLoading, setIsLoading] = useState(false);

  // State for generated description
  const [description, setDescription] = useState('');
  const [description2, setDescription2] = useState('');

  useEffect(() => {
    // Call the getMessagesPython function only once when the component mounts
    getMessagesPython();
  }, []);
  const getMessagesPython = async () => {
    try {
      const response = await fetch(`http://localhost:5000/messages?arg1=${token}`);
      const data = await response.json();
      return data; // Return the response
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const generateBook = async () => {
    // Show loading spinner
    setIsLoading(true);

    try {
      // Call the getMessagesPython function here
      const messagesData = await getMessagesPython();

      // Send the user input to the server-side code using AJAX or fetch API
      const response = await fetch('http://localhost:5000/generateBook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messagesData }) // Pass the messagesData in the request body
      });

      const data = await response.json();
      // Hide loading spinner
      setIsLoading(false);
      // Set the generated description
      setDescription2(data.description);
    } catch (error) {
      // Hide loading spinner
      setIsLoading(false);
      // Display error message
      setDescription2('Error: ' + error);
    }
  };


  // Function to handle button click event
  const generateDescription = () => {
    // Show loading spinner
    setIsLoading(true);

    // Send the user input to the server-side code using AJAX or fetch API
    fetch('http://localhost:5000/generate-description', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ userInput: userInput })
})
      .then(response => response.json())
      .then(data => {
        // Hide loading spinner
        setIsLoading(false);

        // Set the generated description
        setDescription(data.description);
      })
      .catch(error => {
        // Hide loading spinner
        setIsLoading(false);

        // Display error message
        setDescription('Error: ' + error);
      });
  };
const message = "Generating response..."
const linkStartIndex = description.indexOf('http://');
const first_message = description.substring(0, linkStartIndex);
const lastCharacterIndex = description.length-1;
var link = description.substring(linkStartIndex, lastCharacterIndex+1);
if (description.charAt(lastCharacterIndex) === '.'){
  link = description.substring(linkStartIndex, lastCharacterIndex);
}
const linkStartIndex2 = description2.indexOf('http://');
const first_message2 = description2.substring(0, linkStartIndex2);
const lastCharacterIndex2 = description2.length-1;
var link2 = description2.substring(linkStartIndex2, lastCharacterIndex2+1);
if (description2.charAt(lastCharacterIndex2) === '.'){
  link2 = description2.substring(linkStartIndex2, lastCharacterIndex2);
}
  return (
    
    <Layout>
      <div>
      {responseData}
      </div>
      <div className='BG' style={{ backgroundImage: `url(${"https://images6.alphacoders.com/330/330109.jpg"})`}}>
        <div className="center-align BG" >
            <label className='sentence' htmlFor="book-input" style={{marginBottom:30}}>Enter a book description or keywords:</label>
            <input
              type="text"
              id="book-input"
              value={userInput}
              onChange={event => setUserInput(event.target.value)}
            />
            <div>
            <button id="generate-btn" class="mt-3 mx-auto d-block btn btn-outline-primary" onClick={generateDescription}>Generate Description</button>
            </div>
            <div>
            <button id="generate-btn" class="mt-3 mx-auto d-block btn btn-outline-primary" onClick={generateBook}>suggest book according to messages</button>
            </div>
            {isLoading ?(
              <LoadingBooks parameter = {message}/>
            ):
            <div id="result">
              <p><b>A recommended book according to your input </b></p>
              <p>{first_message}</p>
              <p>{description === "please insert input"? 
              description
              : <a href={link}>{link}</a>}</p>
              <hr></hr>
              <p><b>A recommended book according to your messages</b></p>
              <p>{first_message2}</p>

              <p><a href={link2}>{link2}</a></p>

            </div>
            
    }
          </div>
      </div>
    </Layout>
  );
}

export default BookDescriptionGenerator;
