// src/pages/About.js
import React from 'react';
import { CardContainer, CardBody, CardItem } from '../components/ui/3d-card'; // Import the 3D card components
import './About.css'; // Import any additional styles for About
import backgroundImage from '../assets/images/background.jpg'; // Import the background image

const About = () => {
    const aboutCardsData = [
        {
            title: 'What we offer!',
            description: 'The IREITs Platform is a decentralized, blockchain-based solution aimed at transforming the real estate investment landscape.',
            image: require('../assets/images/image1.jpg'), // Replace with actual image path
        },
        {
            title: 'Why Choose Us?',
            description: ' Liquidity and Flexibility,Low Minimum Investment, Secure Transactions and Decision making via proposals voting',
            image: require('../assets/images/image2.jpg'), // Replace with actual image path
        },
        {
            title: 'Our Values',
            description: 'Description of our values.',
            image: require('../assets/images/image3.jpg'), // Replace with actual image path
        },
    ];

    return (
        <div className="about bg-ret-dark text-white" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
            <CardContainer containerClassName="p-6">
                <div className="card-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {aboutCardsData.map((card, index) => (
                        <CardItem key={index} className="card-item bg-ret-purple hover:bg-ret-pink transition duration-300 rounded-lg shadow-lg">                            <CardBody style={{ height: '100%' }}> {/* Ensure CardBody takes full height */}
                                <img src={card.image} alt={card.title} className="w-full h-32 object-cover rounded-t-lg" />
                                <h2 className="text-xl font-semibold mt-4">{card.title}</h2>
                                <p className="text-center mt-2">{card.description}</p>
                            </CardBody>
                        </CardItem>
                    ))}
                </div>
            </CardContainer>
        </div>
    );
};

export default About;