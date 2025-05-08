import { useRef, useState } from 'react'
import './App.css'
import React from 'react';
import ReactDOM from 'react-dom/client';
import Survey from './components/survery/Survey';
import NavBar from './components/NavBar';
import { Survey as SurveyModel } from './models/Survey';
import { Question as QuestionModel, QuestionType} from './models/Question';
import { Answer as AnswerModel} from './models/Answer';
import Question from './components/question/Question';
export default function App() {

  const [survey, setSurvey] = useState<SurveyModel>({
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
              {questionId: 1, id:4, content:"earthworm likes it"}]
          } as QuestionModel],
    editQuestionId: 0,
    addOrEditQuestion: false
  })

  const handleShowQuestionModal = (show: boolean, resetEditQuestionId: boolean) => {
    setSurvey((survey) => {
      return {
        ...survey,
        addOrEditQuestion: show,
        editQuestionId: resetEditQuestionId? 0: survey.editQuestionId
      }
    }) 
  }

  const handleSaveQuestion = (questionToUpdate : QuestionModel) => {
    setSurvey((survey) => {
      const questionUptoDate = survey.questions.filter(question => question.id !== questionToUpdate.id);
      if (questionUptoDate) {

      }
      return {
        ...survey,
    /*    questions: survey.questions.map((question) => {
          if (question.id === questionToUpdate.id) {
            return {
              ...question,
              questionToUpdate
            }
          }
          return question
        }),  */
        questions: [...survey.questions, questionToUpdate],
        editQuestionId: questionToUpdate.id
      }
    })
  }

const handleSaveAnswer = (questionId: number, answer: AnswerModel) => {
  setSurvey((survey) => {
    return {
     ...survey,
      questions: survey.questions.map((question) => {
        if (question.id === questionId) {
          return {
            ...question,
            answers: [...question.answers, answer]
          }
        }
        return question
      })
    }
  })
}

  return (
    <>
      <NavBar onHandleShowQuestionModal={handleShowQuestionModal}/>
      <Survey {...survey} showQuestionModal={handleShowQuestionModal} onSaveQuestion={handleSaveQuestion} onSaveAnswer={handleSaveAnswer}></Survey>
    </>
  )
}