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
    return(
        <div className = 'playerItem'>
            <div className='userNameDiv'>
                {props.member.userName}
            </div>
            <div className = 'scoreDiv'>
                {props.member.score}
            </div>
        </div>
    )
}

class Players extends React.Component<Props, State>{
    constructor(props : Props){
        super(props);
        this.state = {
            members : [
                {socketId : '12341344', userName : 'Abdur rafi',score:0},
                {socketId : '123151324', userName : 'Abrar nafi',score:200},
                {socketId : '', userName : 'Abdur nafi',score:30},
                {socketId : '213', userName : 'Abdur nafi as df asdfsdfs dfasdf ',score:30000},
                {socketId : '12341344', userName : 'Abdur rafi',score:100},
                {socketId : '123151324', userName : 'Abrar nafi',score:200},
                {socketId : '', userName : 'Abdur nafi',score:300},
                {socketId : '213', userName : 'Abdur nafi as df asdfsdfs dfasdf ',score:300},
                {socketId : '12341344', userName : 'Abdur rafi',score:100},
                {socketId : '123151324', userName : 'Abrar nafi',score:200},
                {socketId : '', userName : 'Abdur nafi',score:300},
                {socketId : '213', userName : 'Abdur nafi as df asdfsdfs dfasdf ',score:300}
            ],
            drawer : {
                socketId : '',
                userName : ''
            }
        }
    }

    componentDidMount(){
        socket.on('updatePlayers', data=>{
            console.log(data);
            this.setState({
                members : data.members
            })
        })
        socket.on('updateDrawer', data=>{
            this.setState({
                drawer : data.drawer
            })
        })
    }



    render():React.ReactNode{
        let index = 0;
        // let items = this.state.members.map(m =>(
        //     <div key={index++} className='playerItem'>
        //         <div className='userNameDiv'>
        //             {m.userName}
        //         </div>
        //         <div className='scoreDiv'>
        //             {'score : ' + m.score}
        //             {
        //                 m.socketId === this.state.drawer.socketId &&
        //                 <div>
        //                     current Drawer
        //                 </div>
        //             }
        //         </div>
        //         {/* {m.userName + ' score : ' + m.score} */}
        //     </div>
            
        // ))

        return(
            <div>
                
                <div className = 'players-bar'>
                    {this.state.members.map(m => <PlayerItem member={m} />)}
                </div>
                {/* <div>
                    <ColorPalette changeColor = {this.props.changeColor} />
                </div> */}
            </div>
        )
    }
}

export default Players;