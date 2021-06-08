import React from 'react';
import {io, Socket} from 'socket.io-client'
import Chat from './chat';
import DrawingBoard from './DrawingBoard';
import Players from './players';
import * as constants from '../constants';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';


class Main extends React.Component<{},{}>{


    componentDidMount(){
        // this.socket = io(constants.url);
    }


    render() : React.ReactNode {
        return(
            <div className = 'main' >
                <Players />
                <DrawingBoard />
                <Chat />
            </div>
        )
    }
}

export default Main;