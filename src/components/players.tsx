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
            members : [],
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
        let items = this.state.members.map(m =>(
            <div>
                {m.userName + ' score : ' + m.score}
            </div>
        ))
        return(
            <div className = 'players-bar'>
                {items}
                <div>
                    {"current drawer : " + this.state.drawer.userName}
                </div>
            </div>
        )
    }
}

export default Players;