import React from "react";
import { Link } from "react-router-dom";

const ConversationItem = ({conversation}) => {
    let nameList = [];
    let redirect = '/conversations/' + conversation._id;
    for (const item of ([...Object.values(conversation.names)])){
        console.log(item);
        nameList.push(item);
    }
    return (
        <div className="card row">
            <Link to={redirect}>


            <div className="card-body">
                <div className="col">
                {
                    nameList.map((name) => (
                        <div className="col xs"> {name} </div>
                    ))
                }
                </div>
            </div>
            </Link>
        </div>
    )
};
export default ConversationItem;