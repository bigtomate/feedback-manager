import { Answer as AnswerModel} from "./Answer";
export type QuestionType = "single_choice" | "multiple_choice" | "text_input" | "matrix";
export const questionTypeMap =  {'single_choice': 'Single Choice', 'multiple_choice': 'Multiple Choice', 'text_input': 'Text Input', 'matrix': 'Matrix'};


export interface Question {
  surveyId: number;
  id: number;
  content: string; 
  type: QuestionType; 
  answers : AnswerModel[]
}

export interface QuestionProps extends Question {
  rowIndex?: number;
}
