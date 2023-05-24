import React, { useState } from 'react';
// Layout
import Layout from "../../layout";

function BookDescriptionGenerator() {
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleGenerateDescription = () => {
    setLoading(true);

    fetch('/generate-description', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setDescription(data.description);
        setError('');
      })
      .catch((error) => {
        setLoading(false);
        setDescription('');
        setError(`Error: ${error}`);
      });
  };

  return (
    <Layout>
    <div className="container py-5"></div>
    <div>
      <h1>Book Description Generator</h1>

      <label htmlFor="book-input">Enter a book description or keywords:</label>
      <input type="text" id="book-input" value={userInput} onChange={handleInputChange} />

      <button id="generate-btn" onClick={handleGenerateDescription}>
        Generate Description
      </button>

      {loading && (
        <div id="loading-spinner">
          <img src="spinner.gif" alt="Loading" width="50" height="50" />
          <p>Loading...</p>
        </div>
      )}

      {description && (
        <div id="result">
          <p>{description}</p>
        </div>
      )}

      {error && (
        <div id="result">
          <p>{error}</p>
        </div>
      )}
    </div>
    </Layout>
  );
}

export default BookDescriptionGenerator;
