import React from "react";

const MessageItem = ({message, name}) => {

    return (
        <div className="card">
            <div className="card-body">
                <div
                    className="message-container row"
                    title={`Sent at ${new Date(message.created).toLocaleTimeString()}`}
                >
                    <span>
                        {name}
                    </span>
                    {/*<span className="user col">{message.author_name}:</span>*/}
                    <span className="message col">{message.body}</span>
                    <span className="date col">{new Date(message.created).toLocaleTimeString()}</span>
                </div>
            </div>
        </div>

    )
};
export default MessageItem;