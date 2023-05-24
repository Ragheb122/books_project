import React from 'react';
import Layout from "../../layout";
import "./AboutPage.css";


const AboutPage = () => {
  return (
    <Layout>
    <div className="container py-5">
        <div className="about-container">
        <h1>About Us</h1>
        <p>
            Welcome to our Books Exchange website! We are passionate about promoting the love for reading and connecting book enthusiasts around the world.
        </p>
        <p>
            Our platform is designed to facilitate the exchange of books between users, allowing you to share your favorite reads and discover new ones. But we don't stop there! We have also implemented a powerful recommendation system to enhance your book browsing experience.
        </p>
        <p>
            Our recommendation system analyzes your book preferences, reading history, and user interactions to provide personalized book recommendations tailored just for you. Whether you are looking for a thrilling mystery, a heartwarming romance, or an insightful non-fiction book, our system will suggest books that align with your interests.
        </p>
        <p>
            Join our vibrant community of book lovers, create your profile, and start exploring the world of literature. Connect with fellow readers, browse an extensive collection of books, and exchange your favorite titles. Our user-friendly interface and intuitive features make it easy for you to find, request, and lend books.
        </p>
        <p>
            We value your feedback and continuously strive to improve our platform. If you have any suggestions, questions, or concerns, please don't hesitate to reach out to our support team. Happy reading and happy book exchanges!
        </p>
        </div>
        </div>
        </Layout>
    );
    };

export default AboutPage;
