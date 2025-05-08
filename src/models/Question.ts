import { Answer as AnswerModel} from "./Answer";
export type QuestionType = "single_choice" | "multiple_choice" | "text_input" | "matrix";
export interface Question {
  surveyId: number;
  id: number;
  content: string; 
  type: QuestionType; 
  answers : AnswerModel[]
}