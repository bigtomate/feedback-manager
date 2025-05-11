import React from 'react';
import '../styles/Survey.css';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Button from '@mui/material/Button';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
const NavBar = ({ onHandleShowQuestionModal }) => {
  return (
    <nav className="survey-navbar">

      <Button variant="contained" startIcon={<AddBoxIcon />}  onClick={() => onHandleShowQuestionModal(true, true)}>
        Add Question
      </Button> 
   
     

      <Button variant="contained" startIcon={<SettingsBackupRestoreIcon />} onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}>Reset Survey</Button>
    </nav>
  );
};

export default NavBar;