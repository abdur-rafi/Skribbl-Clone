import React from 'react';
import { player } from '../socketEventsTypes';
import {socket } from './Home'

interface State{
    value : string,
    messages : {
        message : string, 
        sender : player
    }[]
}

interface Props{

}

class Chat extends React.Component<Props, State>{
    constructor(props : Props){
        super(props);
        this.state = {
            value : '', 
            messages : []
        }
        this.sendMessage = this.sendMessage.bind(this);
    }

    sendMessage(){
        socket.emit('message', {
            message : this.state.value
        })
    }

    componentDidMount(){
        socket.on('message', data=>{
            this.setState(old=>({
                messages : [...old.messages, data]
            }))
        })
    }

    render():React.ReactNode{
        let index = 0;
        let m = this.state.messages.map(m => (
            <div className='messageItem' key={index++}>
                {/* {m.sender.userName + ': ' + m.message} */}
                <div className='userName'>
                        {m.sender.userName}
                </div>
                <div className='messageDiv'>
                    <div>
                        { ': ' + m.message}
                    </div>
                </div>
                {/* { m.sender.userName + " : " + m.message} */}
            </div>
        ))
        return(
            <div className = 'chat-bar'>
                <div className='messageList'>
                    {m}
                </div>
                <div className='textInput-div'>
                    <input type='text' value = {this.state.value} onChange = {e=>this.setState({
                        value : e.target.value
                    })} />
                    <button onClick = {this.sendMessage}> Send </button>
                </div>
            </div>
        )
    }
}

export default Chat;