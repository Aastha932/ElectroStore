import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-links">
          <a href="#about" className="footer-link">About Us</a>
          <a href="#privacy" className="footer-link">Privacy Policy</a>
          <a href="#terms" className="footer-link">Terms of Service</a>
          <a href="#support" className="footer-link">Customer Support</a>
        </div>
        <p>&copy; {new Date().getFullYear()} ElectroStore. All rights reserved. Built with React, Spring Boot, and MySQL.</p>
      </div>
    </footer>
  );
};

export default Footer;
