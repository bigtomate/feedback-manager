import React from "react"
import { Answer as AnswerModel } from "../../../models/Answer"
const Answer : React.FC<AnswerModel> = ({...props}) => {
    return (
        <div className="answer-container">
            <input type="radio" name="answer" value={props.id} />
            <label>{props.content}</label>
        </div>
    )
}
export default Answer;