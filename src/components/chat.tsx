import React from 'react';

interface State{

}

interface Props{

}

class Chat extends React.Component<Props, State>{
    constructor(props : Props){
        super(props);

    }

    render():React.ReactNode{
        return(
            <div className = 'chat-bar'>
                Chat
            </div>
        )
    }
}

export default Chat;