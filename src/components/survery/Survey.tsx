import React, { useState } from 'react';
import { Survey as SurveyModel} from "../../models/Survey"
import  Question  from '../../components/question/Question';
import Modal from '../shared/Modal';
import '../../styles/Survey.css';
import '../../styles/QuestionForm.css';
const Survey: React.FC<SurveyModel> = ({showQuestionModal, onSaveQuestion, onSaveAnswer, ...props}) =>  {
  return (
    <>
      <div className="survey-container">
        <h1 className="survey-title">{props.title}</h1>
        <p className="survey-description">{props.description}</p>
        <div className="questions-container">
        {props.questions.map((question) => (
        <Question key={question.id} {...question} />
      ))}
      </div>
      </div>
  
    <Modal
        isOpen={props.addOrEditQuestion} 
        onClose={() => {
        showQuestionModal(false, true);
    }}
    onSaveAnswer = {onSaveAnswer}
    onSaveQuestion={onSaveQuestion}
    {...props}
    >
     </Modal>
    </>
  );
};

export default Survey