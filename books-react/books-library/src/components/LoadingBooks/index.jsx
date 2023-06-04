import React from 'react';
import './LoadingBooks.css'; // Import your custom CSS file for styling the loader
const LoadingBooks = (message) => {
  const { parameter } = message;
  return (
    <div className="loader-container">
      <p className="loading-message">{parameter}</p>
      <div className="loader"></div>
    </div>
  );
};

export default LoadingBooks;