import { QuestionType } from "./Question";
import { SubAnswer as SubAnswerModel} from "./SubAnswer";
export interface Answer {
    questionId: number;
    id: number;
    content: string;
    subanswers: SubAnswerModel[];
}

export interface AnswerProps extends Answer {
    questionType: QuestionType;
    rowIndex?: number; 
}