
import '../../styles/Modal.css';
import React, { useState } from 'react';
import { Survey as SurveyModel } from "../../models/Survey"
import { Question as QuestionModel, QuestionType } from "../../models/Question"
import { Answer as AnswerModel } from "../../models/Answer"
import '../../styles/Survey.css';
import '../../styles/QuestionForm.css';
import Answer from '../../components/answer/answer-item/Answer';

const Modal = ({showQuestionModal, onSaveQuestion, onSaveAnswer, isOpen, onClose, ...props}) => {

  const [type, setType] = useState<QuestionType>("single_choice");
  const [questionTitle, setQuestionTitle] = useState('');
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState<AnswerModel>({} as AnswerModel);

  const questionToEdit = props.questions.find(q => q.id === props.editQuestionId);

  const handleSubmit = () => {
    if (!questionTitle.trim()) {
      setError('Question is required');
      return;
    }
    setError('')
    const updateQuestion: QuestionModel = {
      surveyId: props.id,
      id: props.editQuestionId != 0 ? props.editQuestionId : props.questions.length + 1,
      content: questionTitle,
      type: type,
      answers: questionToEdit?.answers ? [...questionToEdit.answers, answer] : [],
    };
    onSaveQuestion(updateQuestion)
  };

  const handleAddAnswer = () => {
    let answerId = 0;
    props.questions.forEach(q => answerId += q.answers.length);
    if (questionToEdit) {
      setQuestionTitle(questionToEdit.content);
      setType(questionToEdit.type);
      answer.id = answerId + questionToEdit.answers.length + 1;
      onSaveAnswer(questionToEdit.id, answer)
    }
  }

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <button className="modal-close" onClick={() => {
            setQuestionTitle(''),
              setType("single_choice"),
              setError(''),
              onClose()
          }}>X</button>
          <div>
            <div className="edit-container">
              <h3>Create New Question</h3>
              <div className="question-section">
                <p>Question:</p>
                <textarea
                  className='question-textarea'
                  placeholder="Enter question"
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                />
                {error && <div className="error-message">{error}</div>}
              </div>
              <div>
                <p>Type:</p>
                <select
                  className="form-select"
                  value={type}
                  onChange={(e) => setType(e.target.value as "single_choice" | "multiple_choice" | "text_input" | "matrix")}
                >
                  <option value="single_choice">Single Choice</option>
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="text_input">Text Input</option>
                  <option value="matrix">Matrix</option>
                </select>
              </div>

<div className='answer-section'>
  {questionToEdit && <h4>Answer</h4>}
          {questionToEdit?.answers.map((answer) => (
          <Answer key={answer.id} {...answer} />
      ))}
</div>
              <div className='answer-input answer-edit-section'>
                {props.editQuestionId != 0 && <>
                  <label htmlFor='textarea'>Answer: </label>
                  <textarea
                    placeholder="Enter answer text"
                    onChange={(e) => setAnswer({ ...answer, content: e.target.value })}
                  />
                  <button 
                    onClick={handleAddAnswer}>
                    Add
                  </button>
                </>
                }
              </div>

              <div className="action-buttons">
                <button onClick={handleSubmit}> Save </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;