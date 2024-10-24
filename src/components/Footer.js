// src/components/Footer.js
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import './Footer.css'; // Import the CSS for the footer

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Socials Grid */}
        <div className="footer-section">
          <h2 className="footer-title">Socials</h2>
          <div className="social-icons">
            <a href="https://x.com/WinnyMuusi" target="_blank" rel="noopener noreferrer">
              <div className="social-item">
                <FontAwesomeIcon icon={faTwitter} />
                <h1>Twitter(X)</h1>
              </div>
            </a>
            <a href="https://www.linkedin.com/in/winfred-muusi-b7062b244/" target="_blank" rel="noopener noreferrer">
              <div className="social-item">
                <FontAwesomeIcon icon={faLinkedin} />
                <h1>Linkedin</h1>
              </div>
            </a>
          </div>
        </div>
        {/* Navigation Grid */}
        <div className="footer-section">
          <h2 className="footer-title">Quick Links</h2>
          <ul className="footer-links">
            <li>
              <Link to="/" className="footer-link">Home</Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">About</Link>
            </li>
            <li>
              <Link to="/properties" className="footer-link">Properties</Link>
            </li>
            <li>
              <Link to="/dashboard" className="footer-link">Dashboard</Link>
            </li>
            <li>
              <Link to="/voting" className="footer-link">Voting</Link>
            </li>
          </ul>
        </div>
        {/* Additional Links Grid */}
        <div className="footer-section">
          <h2 className="footer-title">Resources</h2>
          <ul className="footer-links">
            <li>
              <Link to="/terms" className="footer-link">Terms and Conditions</Link>
            </li>
            <li>
              <Link to="/faq" className="footer-link">FAQs</Link>
            </li>
          </ul>
        </div>
      </div>
      <p className="footer-bottom">
        Copyright &copy; {new Date().getFullYear()} All rights reserved by{" "}
        <a href="#" className="footer-link">IREITS</a>
      </p>
    </footer>
  );
};

export default Footer;