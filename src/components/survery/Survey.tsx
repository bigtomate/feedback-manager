import React, { useState } from 'react';
import { Survey as SurveyModel, SurveyProps} from "../../models/Survey"
import  Question  from '../../components/question/Question';
import Modal from '../shared/Modal';
import '../../styles/Survey.css';
import '../../styles/QuestionForm.css';

const Survey: React.FC<SurveyProps> = ({showQuestionModal, onSaveQuestion, onSaveAnswer, ...props}) =>  {
  return (
    <>
      <div className="survey-container">
        <h1 className="survey-title">{props.title}</h1>
        <p className="survey-description">{props.description}</p>
        <div className="questions-container">
        {props.questions.map((question) => (
        <Question key={question.id} showQuestionModal = {showQuestionModal}  {...question} />
      ))}
      </div>
      </div>
  
    <Modal
        isOpen={props.addOrEditQuestion} 
        showQuestionModal = {showQuestionModal}
        onSaveAnswer = {onSaveAnswer}
        onSaveQuestion = {onSaveQuestion}
    {...props}
    >
     </Modal>
    </>
  );
};

export default Survey