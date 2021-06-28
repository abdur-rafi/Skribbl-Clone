import React from 'react';
import { player, member } from '../socketEventsTypes';
import {socket} from './Home'
interface State{
    members : member[],
    drawer : player
}

interface Props{

}


const PlayerItem : React.FC<{
    member : member
}> = (props)=>{

    const playerDiv : HTMLDivElement | null= document.querySelector(`#${props.member.socketId}`);
    let x = -1; let y = -1;
    if(playerDiv){
        let box = playerDiv.getBoundingClientRect();
        x = box.right;
        y = box.y + (box.bottom - box.y) / 2 - 20;
    }

    return(
        <div style={{
            display : 'flex',
            width : '200px'
        }}>
            <div className = 'playerItem' id = {props.member.socketId}>
                <div className='userNameDiv'>
                    {props.member.userName}
                </div>
                <div className = 'scoreDiv'>
                    {props.member.score}
                </div>
                
            </div>
            <div className = 'playerBarMessage' style={{
                display : props.member.message ? 'block' : 'none',
                top : `${y}px`,
                left : `${x}px`,
            }}>
                {props.member.message}
            </div>
        </div>
    )
}

class Players extends React.Component<Props, State>{
    constructor(props : Props){
        super(props);
        this.state = {
            members : [
                // {socketId : '12341344', userName : 'Abdur rafi',score:0 , turnScore : 0},
                // {socketId : '123151324', userName : 'Abrar nafi',score:200, turnScore : 0},
                // {socketId : '', userName : 'Abdur nafi',score:30, turnScore : 0},
                // {socketId : '213', userName : 'Abdur nafi as df asdfsdfs dfasdf ',score:30000, turnScore : 0},
                // {socketId : '12341344', userName : 'Abdur rafi',score:100, turnScore : 0},
                // {socketId : '123151324', userName : 'Abrar nafi',score:200, turnScore : 0},
                // {socketId : '', userName : 'Abdur nafi',score:300, turnScore : 0},
                // {socketId : '213', userName : 'Abdur nafi as df asdfsdfs dfasdf ',score:300, turnScore : 0},
                // {socketId : '12341344', userName : 'Abdur rafi',score:100, turnScore : 0},
                // {socketId : '123151324', userName : 'Abrar nafi',score:200, turnScore : 0},
                // {socketId : '', userName : 'Abdur nafi',score:300, turnScore : 0},
                // {socketId : '213', userName : 'Abdur nafi as df asdfsdfs dfasdf ',score:300, turnScore : 0}
            ],
            drawer : {
                socketId : '',
                userName : ''
            }
        }
    }

    componentDidMount(){
        socket.on('updatePlayers', data=>{
            this.setState({
                members : data.members
            })
        })
        socket.on('turnEnd', data=>{
            this.setState({
                members : data.members
            })
        })
        socket.on('updateDrawer', data=>{
            this.setState({
                drawer : data.drawer
            })
        })
        socket.on('message', data=>{
            this.setState(old=>({
                members : old.members.map(m =>{
                    if(m.socketId != data.sender.socketId) return m;
                    return {
                        ...m,
                        message : data.message
                    }
                })
            }), ()=>{
                setTimeout(()=>{
                    this.setState(old=>({
                        members : old.members.map(m =>{
                            if(m.socketId != data.sender.socketId) return m;
                            return {
                                ...m,
                                message : null
                            }
                        })
                    }))
                }, 2000);
            })
        })
        
    }



    render():React.ReactNode{
        return(
            <div>
                <div className = 'players-bar'>
                    {this.state.members.map(m => <PlayerItem member={m} key = {m.socketId}/>)}
                </div>
            </div>
        )
    }
}

export default Players;