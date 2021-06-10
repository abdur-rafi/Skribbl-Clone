import React from 'react';
import {io, Socket} from 'socket.io-client'
import Chat from './chat';
import DrawingBoard from './DrawingBoard';
import Players from './players';


interface State{
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