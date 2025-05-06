import { Answer } from "../answer/Answer";
export interface Question {
 surveyId: string | number;
  id: string | number;
  content: string; 
  type: string; 
  answers : Answer[]
}