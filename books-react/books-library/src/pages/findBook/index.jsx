import React, { useState } from 'react';
// Layout
import Layout from "../../layout";
import "./searchBook.css";
import LoadingChatGPT from '../../components/loadingChatGPT';



function BookDescriptionGenerator() {
  // State for user input
  const [userInput, setUserInput] = useState('');

  // State for loading spinner visibility
  const [isLoading, setIsLoading] = useState(false);

  // State for generated description
  const [description, setDescription] = useState('');

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

  return (
    
    <Layout>
    <div className="center-align">
        <label htmlFor="book-input">Enter a book description or keywords:</label>
        <input
          type="text"
          id="book-input"
          value={userInput}
          onChange={event => setUserInput(event.target.value)}
        />
  
        <button id="generate-btn" class="mt-3 mx-auto d-block btn btn-primary" onClick={generateDescription}>Generate Description</button>
  
        {isLoading ?(
          <LoadingChatGPT/>
        ):
  
        <div id="result">
          <p>{description}</p>
        </div>
}
      </div>
    </Layout>
  );
}

export default BookDescriptionGenerator;
