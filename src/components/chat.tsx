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

const MessageItem : React.FC<{
    message : {
        message : string, 
        sender : player
    }
}> = (props)=>{
    return(
        <div className = 'messageItem'>
            <div className = 'userNameDiv'>
                <div>
                    {props.message.sender.userName}
                </div>
            </div>
            <div className = 'messageDiv'>
                
                {props.message.message}
            </div>
        </div>
    )
}

class Chat extends React.Component<Props, State>{
    
    messageListRef : React.RefObject<HTMLDivElement>
    constructor(props : Props){
        super(props);
        this.state = {
            value : '', 
            messages : [
                {message : 'asdf asdf asdf asdf sadfsdfasdf sadfasdf asdfsadf sadfasdf asdf asdf asdf ',
                sender : {
                    socketId : 'asdfasdf',
                    userName : 'Abdur Rafi'
                },   
                },
                {message : 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdf asdf asdf asdf asdf ',
                sender : {
                    socketId : 'asdfasdf',
                    userName : 'Abdur Rafi'
                },   
                },
                {message : 'asdf asdf asdf asdf asdf ',
                sender : {
                    socketId : 'asdfasdf',
                    userName : 'Abdur Rafi'
                },   
                },
            ]
        }
        this.messageListRef = React.createRef()
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
            }),()=>{
                if(this.messageListRef.current){
                    this.messageListRef.current.scrollTop = this.messageListRef.current.scrollHeight;
                }
            })
        })
    }

    render():React.ReactNode{
        return(
            <div className = 'chat-bar'>
                <div className='messageList' ref = {this.messageListRef}>
                    {
                        this.state.messages.map(m => <MessageItem message = {m} />)
                    }
                </div>
                <div className='textInput-div'>
                    <input type='text' value = {this.state.value} placeholder='Enter your guess here' onChange = {e=>this.setState({
                        value : e.target.value
                    })} onKeyPress = {e => {
                        if(!e.shiftKey && e.key == 'Enter'){
                            this.sendMessage();
                            this.setState({
                                value : ''
                            })
                        }
                    }} />
                </div>
            </div>
        )
    }
}

export default Chat;