import React from 'react';
import {io, Socket} from 'socket.io-client'
import Chat from './chat';
import DrawingBoard from './DrawingBoard';
import Players from './players';
import {socket } from './Home'
import * as constants from '../constants';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';

interface State{
    drawer : string
}

interface Props{

}

class Main extends React.Component<Props, State>{

    constructor(props : Props){
        super(props);
    }
    

    componentDidMount(){

    }


    render() : React.ReactNode {
        return(
            <div className = 'main' >
                <Players/>
                <DrawingBoard />
                <Chat />
            </div>
        )
    }
}

export default Main;