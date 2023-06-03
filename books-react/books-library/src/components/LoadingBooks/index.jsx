import React from 'react';
import './LoadingBooks.css'; // Import your custom CSS file for styling the loader

const LoadingBooks = () => {
  return (
    <div className="loader-container">
      <p className="loading-message">Recommendation system is generating books that we suggest for you...</p>
      <div className="loader"></div>
    </div>
  );
};

export default LoadingBooks;