import React from 'react';
import { player, member } from '../socketEventsTypes';
import {socket} from './Home'
interface State{
    members : member[],
    drawer : player
}

interface Props{

}



class Players extends React.Component<Props, State>{
    constructor(props : Props){
        super(props);
        this.state = {
            members : [
                {socketId : '12341344', userName : 'Abdur rafi',score:100},
                {socketId : '123151324', userName : 'Abrar nafi',score:200},
                {socketId : '', userName : 'Abdur nafi',score:300}
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
        let items = this.state.members.map(m =>(
            <div key={index++} className='playerItem'>
                <div className='userNameDiv'>
                    {m.userName}
                </div>
                <div className='scoreDiv'>
                    {'score : ' + m.score}
                    {
                        m.socketId === this.state.drawer.socketId &&
                        <div>
                            current Drawer
                        </div>
                    }
                </div>
                {/* {m.userName + ' score : ' + m.score} */}
            </div>
            
        ))
        return(
            <div className = 'players-bar'>
                {items}
            </div>
        )
    }
}

export default Players;