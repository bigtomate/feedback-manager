import { Question as QuestionModel } from "../models/Question";
import { Answer as AnswerModel } from "../models/Answer";
export interface Survey {
    id: number;
    title: string;
    description: string;
    editQuestionId: number;
    addOrEditQuestion: boolean;
    questions: QuestionModel[];
}

export interface SurveyProps extends Survey {
    showQuestionModal: (show: boolean, resetEditQuestionId: boolean) => void;
    onSaveQuestion: (question: QuestionModel) => void;
    onSaveAnswer: (questionId: number, answer: AnswerModel) => void;
}