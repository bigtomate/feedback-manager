import { Question as QuestionModel } from "../models/Question";
export interface Survey {
    id: number;
    title: string;
    description: string;
    editQuestionId: number;
    addOrEditQuestion: boolean;
    questions: QuestionModel[];
}