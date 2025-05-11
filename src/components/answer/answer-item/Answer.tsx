import React from "react";
import { Answer as AnswerModel, AnswerProps } from "../../../models/Answer";
import { questionTypeMap } from "../../../models/Question";



const Answer: React.FC<AnswerProps> = ({...props }) => {
    const isTextInput = questionTypeMap[props.questionType] === questionTypeMap.text_input;
    const isRadio = questionTypeMap[props.questionType] === questionTypeMap.single_choice;
    const isMatrix = questionTypeMap[props.questionType] === questionTypeMap.matrix;
    const isFirstRow = props.rowIndex === 0;
  

    // Calculate column widths based on subanswer content (for other columns)
    const columnWidths = isMatrix && props.subanswers?.map(subAnswer => {
        const baseWidth = Math.min(Math.max(subAnswer.content.length * 10, 60), 200);
        return `${baseWidth}px`;
    }) || [];

    return (
        <>
        <div className="answer-container">
            {!isTextInput && !isMatrix && (
                <div className="option-container" key={props.id}>
                 {/*   {props.id} */}
                    <input 
                        type={isRadio ? "radio" : "checkbox"} 
                        id={`option-${props.id}`}
                        name={isRadio ? "radio-group" : `checkbox-group-${props.id}`}
                        value={props.id} 
                    />

                   <label htmlFor={`option-${props.id}`}>{props.content}</label>
                </div>
            )}

            {isTextInput && (
                <div className="text-input-container">
                    <p className="text-input-label">{props.content}</p>
                    <textarea 
                        name="answer" 
                        className="text-input-field"
                        rows={3}
                    />
                </div>
            )}
        </div>

        {isMatrix && (
               <table className="matrix-table">
                   {isFirstRow && (
                       <thead>
                           <tr>
                               <th className="matrix-empty-header matrix-header"></th>
                               {props.subanswers?.map((subAnswer, index) => (
                                   <th 
                                       key={subAnswer.id} 
                                       className="matrix-header"
                                       style={{ width: columnWidths[index] }}
                                   >
                                       {subAnswer.content}
                                   </th>
                               ))}
                           </tr>
                       </thead>
                   )}
                   <tbody>
                       
                       <tr>
                           <td className="matrix-row-label">
                               {props.content}
                           </td>
                           {props.subanswers?.map((subAnswer, index) => (
                               <td 
                                   key={subAnswer.id} 
                                   className="matrix-cell"
                                   style={{ width: columnWidths[index] }}
                               >
                                {/* <span>{subAnswer.id}</span> */}
                                   <input 
                                       type="radio" 
                                       name={`matrix-${props.rowIndex}`} 
                                       value={subAnswer.id} 
                                       className="matrix-radio"
                                       style={{ margin: 0 }}
                                   />
                               </td>
                           ))}
                       </tr>
                   </tbody>
               </table>
       )}
        </>)
};

export default Answer;