import { SubAnswer as SubAnswerModel} from "./SubAnswer";
export interface Answer {
    questionId: number;
    id: number;
    content:string;
    subanswers: SubAnswerModel[];
}