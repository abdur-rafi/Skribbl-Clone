import React from 'react';
import { player } from '../socketEventsTypes';
import {socket} from './Home'
interface State{
    players : player[],
    drawer : player
}

interface Props{

}

class Players extends React.Component<Props, State>{
    constructor(props : Props){
        super(props);
        this.state = {
            players : [],
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
                players : data.players
            })
        })
        socket.on('updateDrawer', data=>{
            this.setState({
                drawer : data.drawer
            })
        })
    }



    render():React.ReactNode{
        let items = this.state.players.map(p =>(
            <div>
                {p.userName}
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