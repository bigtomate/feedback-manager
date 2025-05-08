import React from 'react';
import '../styles/Survey.css';


const NavBar = ({ onHandleShowQuestionModal }) => {
  return (
    <nav className="survey-navbar">
    <button 
        onClick={() => onHandleShowQuestionModal(true, true)}>
        Add New Question
      </button>
    </nav>
  );
};

export default NavBar;