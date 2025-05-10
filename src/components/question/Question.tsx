import React from 'react';
import { Question as QuestionModel, questionTypeMap, QuestionProps} from '../../models/Question';
import Answer from '../../components/answer/answer-item/Answer'
const Question : React.FC<QuestionProps> = ({ ...props }) => {
return(<>
<div className="card question-card">
{props.content}
     {props.answers.map((answer, index) => (
        <Answer rowIndex={index} questionType={props.type} key={answer.id} {...answer} />
      ))}
</div>
</>)
}
export default Question;