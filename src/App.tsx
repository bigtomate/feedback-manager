import { useEffect, useState } from 'react'
import './App.css'
import React from 'react';
import Survey from './components/survery/Survey';
import NavBar from './components/NavBar';
import { Survey as SurveyModel } from './models/Survey';
import { Question as QuestionModel} from './models/Question';
import { Answer as AnswerModel} from './models/Answer';

const surveyExample = {
  id:1,
  title: 'Survey organic food',
  description:'survey nr 1 for testing ',
  questions:[{
          surveyId: 1,
          id: 1,
          content: "What is you favorite organic food brand?",
          type: "single_choice",
          answers: [{questionId: 1, id:1, content:"organic valley"},
            {questionId: 1, id:2, content:"pro Nature"},
            {questionId: 1, id:3, content:"adya organics"}, 
            {questionId: 1, id:4, content:"amway nutrilite"}]
        } as QuestionModel, {
          surveyId: 1,
          id: 2,
          content: "How often do you eat these organic product?",
          type: "matrix",
          answers: [{questionId: 2, id:5, content:"organic valley", subanswers: [{content: "daily", answerId: 5, id:1}, {content: "weekly", answerId: 5, id:5}, {content: "monthly", answerId: 5, id:9}]},
            {questionId: 2, id:6, content:"pro Nature", subanswers: [{content: "daily", answerId: 6, id:2}, {content: "weekly", answerId: 6, id:6}, {content: "monthly", answerId: 6, id:10}]},
            {questionId: 2, id:7, content:"adya organics",subanswers: [{content: "daily", answerId: 7, id:3}, {content: "weekly", answerId: 7, id:7}, {content: "monthly", answerId: 7, id:11}]}, 
            {questionId: 2, id:8, content:"amway nutrilite",subanswers: [{content: "daily", answerId: 8, id:4}, {content: "weekly", answerId: 8, id:8}, {content: "monthly", answerId: 8, id:12}]}]
        } as QuestionModel],
  editQuestionId: 0,
  addOrEditQuestion: false
} as SurveyModel;

const savedSurvey = localStorage.getItem('survey');
const surveyLocal = savedSurvey ? JSON.parse(savedSurvey) as SurveyModel : surveyExample;
export default function App() {
  const [survey, setSurvey] = useState<SurveyModel>(surveyLocal)
    // Save state to localStorage
    useEffect(() => {
      localStorage.setItem('survey', JSON.stringify(survey));
    // Clear localStorage after 24 hours
    const clearStorage = setTimeout(() => {
    localStorage.clear();
   }, 86400000);

   return () => clearTimeout(clearStorage);
    }, [survey]);
    
  const handleShowQuestionModal = (show: boolean, resetEditQuestionId: boolean, _editQuestionId: number) => {
    setSurvey((survey) => {
       const updatedSurvey = {
        ...survey,
        addOrEditQuestion: show,
        editQuestionId: resetEditQuestionId? 0: _editQuestionId? _editQuestionId : survey.editQuestionId
      }

     localStorage.setItem('survey', JSON.stringify(updatedSurvey));
      return updatedSurvey;
    }) 
  }

  const handleSaveQuestion = (questionToUpdate : QuestionModel) => {
    setSurvey((survey) => {  
      const questionExists = survey.questions.some(q => q.id === questionToUpdate.id);
      if (questionExists) {
        const updatedQuestions = survey.questions.map(question => {
          return question.id === questionToUpdate.id ? questionToUpdate : question;
        });
        const updatedSurvey =  {
          ...survey,
          questions: updatedQuestions,
          editQuestionId: questionToUpdate.id
        };
        localStorage.setItem('survey', JSON.stringify(updatedSurvey));
        return updatedSurvey;
      } else {
        const updatedSurvey = {
          ...survey,
          questions: [...survey.questions, questionToUpdate],
          editQuestionId: questionToUpdate.id
        };
        localStorage.setItem('survey', JSON.stringify(updatedSurvey));
        return updatedSurvey;
      }
    });
  }

const handleSaveAnswer = (questionId: number, answer: AnswerModel) => {
  setSurvey((survey) => {
    const updatedSurvey =  {
     ...survey,
      questions: survey.questions.map((question) => {
        if (question.id === questionId) {
          const answerExists = question.answers.some(a => a.id === answer.id);
          if (answerExists) {
            return {
              ...question,
              answers: question.answers.map(a => a.id === answer.id ? answer : a)
            }
          } else {
            return {
              ...question,
              answers: [...question.answers, answer]
            }
          }
        }
        return question
      })
    }
    localStorage.setItem('survey', JSON.stringify(updatedSurvey));
    return updatedSurvey;
  })
}

  return (
    <>
      <NavBar onHandleShowQuestionModal={handleShowQuestionModal}/>
      <Survey {...survey} showQuestionModal={handleShowQuestionModal} onSaveQuestion={handleSaveQuestion} onSaveAnswer={handleSaveAnswer}></Survey>
    </>
  )
}