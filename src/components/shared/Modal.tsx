
import '../../styles/Modal.css';
import React, { useState } from 'react';
import { Question as QuestionModel, QuestionType, questionTypeMap } from "../../models/Question"
import { Answer as AnswerModel, AnswerProps } from "../../models/Answer"
import { SubAnswer as SubAnswerModel } from "../../models/SubAnswer"
import '../../styles/Survey.css';
import '../../styles/QuestionForm.css';
import Answer from '../../components/answer/answer-item/Answer';
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const Modal = ({ showQuestionModal, onSaveQuestion, onSaveAnswer, isOpen, ...props }) => {

  const [type, setType] = useState<QuestionType>("single_choice");
  const [questionTitle, setQuestionTitle] = useState('');
  const [error, setError] = useState('');
  const [answer, setAnswer] = useState<AnswerModel>({} as AnswerModel);
  const [subAnswer, setSubAnswer] = useState<SubAnswerModel>({} as SubAnswerModel);
  const [editAnswerId, setEditAnswerId] = useState<number | null>(null);
  const questionToEdit: QuestionModel = props.questions.find((q: QuestionModel) => q.id === props.editQuestionId);
  const questions: QuestionModel[] = props.questions;

  const handleSubmit = () => {
    if (!questionTitle.trim() && !questionToEdit?.content.trim()) {
      setError('Question is required');
      return;
    }
    setError('')
    const updateQuestion: QuestionModel = {
      surveyId: props.id,
      id: props.editQuestionId != 0 ? props.editQuestionId : props.questions.length + 1,
      content: questionToEdit?.content.trim()? questionToEdit?.content.trim() : questionTitle,
      type: questionToEdit?.type != null ? questionToEdit.type : type,
      answers: questionToEdit?.answers ? [...questionToEdit.answers] : [],
    };
    onSaveQuestion(updateQuestion)
  };

  const handleAddAnswer = () => {
    if (!answer.content || !answer.content.trim()) {
      if (questionTypeMap[type] !== questionTypeMap['text_input'])
        return;
    }

    const calculatedAnswerId = maxAnswerId();
    if (questionToEdit) {
      answer.id = calculatedAnswerId + 1;
      questionToEdit.answers.push(answer);
      answer.questionId = questionToEdit.id
      if (questionTypeMap[questionToEdit.type] === questionTypeMap['matrix']) {
        // if the first answer has more subanswers than the new answer, 
        // add a new subanswer to this new answer (it happends when a subanswer has been added and then add an answer again)
        // oterwise always initialize a empty subanswer array to the new answer for the matrix type question.
        answer.subanswers = [];
        if (questionToEdit.answers[0].subanswers?.length != 0) {
          questionToEdit.answers[0].subanswers.forEach((subAnswer: SubAnswerModel) => {
            const caulculatedSubAnswerId = maxSubAnswerId();
            answer.subanswers.push({
              ...subAnswer,
              id: caulculatedSubAnswerId + 1, // the subAnswer share exactly the same charastics with the first answer, except the id
            })
          });
        }
      }
    }
    onSaveAnswer(questionToEdit.id, answer)
    setAnswer({} as AnswerModel)
  }

  const handleAddSubAnswer = () => {
    if (!subAnswer.content || !subAnswer.content.trim()) {
      return;
    }

    // add to each answer a new subanswer
    questionToEdit.answers.forEach(answerToUpdate => {
      const calculatedSubAnswerId = maxSubAnswerId();
      const newSubAnswer = {
        ...subAnswer,
        id: calculatedSubAnswerId + 1,
        answerId: answerToUpdate.id,
      };

      answerToUpdate.subanswers?.push(newSubAnswer);
      onSaveAnswer(questionToEdit.id, answerToUpdate);
    });

    setSubAnswer({} as SubAnswerModel);
  }

  const handleClose = () => {
    setQuestionTitle(''),
      setType("single_choice"),
      setError(''),
      showQuestionModal(false, true)
  }

  const handleRemoveAnswer = (answerid: number) => {
    if (questionToEdit) {
      questionToEdit.answers.filter(answer => answer.id !== answerid);
      const updateQuestion: QuestionModel = {
        ...questionToEdit,
        answers: questionToEdit.answers.filter(answer => answer.id !== answerid),
      };
      onSaveQuestion(updateQuestion);
    }
  }

  const handleUpdateAnswer = () => {
    if (!answer.content || !answer.content.trim()) {
      if (questionTypeMap[type] !== questionTypeMap['text_input'])
        return;
    }
    onSaveAnswer(questionToEdit.id, answer)
    setAnswerEditMode(0)
  }

  const setAnswerEditMode = (answerid: number) => {
    setEditAnswerId(prevId => prevId === answerid ? null : answerid);
  }

  function maxAnswerId(): number {
    let max = 0;
    questions.forEach((q: QuestionModel) => q.answers.forEach((a: AnswerModel) => max = max < a.id ? a.id : max));
    return max;
  }

  function maxSubAnswerId(): number {
    let max = 0;
    questions.forEach((q: QuestionModel) => q.answers.forEach((a: AnswerModel) => a.subanswers?.forEach((sa: SubAnswerModel) => max = max < sa.id ? sa.id : max)));
    return max;
  }

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-body">
          <button className="modal-close" onClick={() => {
            handleClose()
          }}>X</button>
          <div>
            <div className="edit-container">
              {questionToEdit?.id? (<h4>Edit Question</h4>):(<h4>Create new Question</h4>)}
              <div className="question-section">
                <p>Question:</p>
                <textarea
                  className='question-textarea'
                  placeholder="Enter question"
                  value={questionToEdit?.content != null ? questionToEdit.content : questionTitle}
                  onChange={(e) => {
                    if (questionToEdit) {
                      const updatedQuestion = { ...questionToEdit, content: e.target.value };
                      onSaveQuestion(updatedQuestion);
                    }
                    setQuestionTitle(e.target.value);
                  }}
                />
                {error && <div className="error-message">{error}</div>}
              </div>
              <div>
             
                <Box sx={{ minWidth: 200, maxWidth: 200 }}>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={questionToEdit?.type != null ? questionToEdit.type : type}
          label="Type"
          onChange={(e) => {
            if (questionToEdit) {
              // if the question type is changed from matrix to other types, remove all the subanswers
              if (questionTypeMap[questionToEdit.type] === questionTypeMap['matrix']) {
                const updatedQuestion = { ...questionToEdit, answers:[], type: e.target.value};
                onSaveQuestion(updatedQuestion);
              } else if (questionTypeMap[e.target.value] === questionTypeMap['matrix']) {
                const updatedQuestion = {...questionToEdit, answers:[], type: e.target.value};
                onSaveQuestion(updatedQuestion);
              }
              else {
                const updatedQuestion = {...questionToEdit, type: e.target.value };
                onSaveQuestion(updatedQuestion);
              }
            }
            setType(e.target.value as QuestionType)
          }
          }
        >
           {Object.entries(questionTypeMap).map(([key, value]) => (
                  <MenuItem key={key} value={key}>{value}</MenuItem>
                    
                  ))}
         
        </Select>
      </FormControl>
    </Box>
             
             {questionToEdit?.answers.length !== 0 && <div  style={{ margin: 5 }}> <span><WarningAmberIcon /></span><span className='info-message'> Changing the question type either from matrix to another type or from another type to matrix will remove the answers.</span>
              </div>}
               </div>

              <div className='answer-section'>
                {questionToEdit && <h4>Answer</h4>}

                {questionToEdit?.answers.map((answer, index) => (
                  <div key={answer.id} style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', marginRight: '10px' }}>
                      <DeleteIcon
                        className='icon-button'
                        onClick={() => {
                          handleRemoveAnswer(answer.id);
                        }} />
                      <ModeEditIcon className='icon-button' onClick={() => {
                        setAnswerEditMode(answer.id);
                      }} />
                    </div>

                    {editAnswerId !== answer.id ? (<div className="answer-edit-container" style={{ flex: 1 }}>
                      <Answer rowIndex={index} questionType={questionToEdit?.type != null ? questionToEdit.type : type}  {...answer} />
                    </div>) :
                      (<div className="answer-edit-container answer-input" style={{ flex: 1 }}>
                        <textarea defaultValue={answer.content}
                          onChange={(e) => setAnswer({ ...answer, content: e.target.value })}
                        />

                        <button className='answer-edit-save' onClick={
                          handleUpdateAnswer}>save</button></div>)}
                  </div>


                ))}
              </div>
              {questionToEdit?.answers.length === 0 && questionTypeMap[type] === questionTypeMap['matrix'] &&
                <div className="info-message">Please add answers first before adding subanswers</div>
              }
              <div className='answer-input answer-edit-section'>
                {props.editQuestionId != 0 && <>
                  <label htmlFor='textarea'>Answer: </label>
                  <textarea
                    style={{ height: '40px', width: '20%', minHeight: '30px' }}
                    placeholder={questionTypeMap[type] !== questionTypeMap['text_input'] ? "Enter answer text" : "Enter Textbox label (optional)"}
                    onChange={(e) => setAnswer({ ...answer, content: e.target.value })}
                  />
                  <button
                    onClick={handleAddAnswer}>
                    {questionTypeMap[type] !== questionTypeMap['text_input'] ? "Add" : "Add Textbox"}
                  </button>
                  {(questionTypeMap[type] === questionTypeMap['matrix'] || questionTypeMap[questionToEdit?.type] === questionTypeMap['matrix'])
                    && <>
                      <textarea
                        style={{ height: '40px', width: '20%', minHeight: '30px' }}
                        placeholder="Enter sub answer text"
                        onChange={(e) => setSubAnswer({ ...subAnswer, content: e.target.value })}
                      />
                      <button
                        onClick={handleAddSubAnswer}
                      >
                        Add SubAnswer
                      </button>
                    </>}
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