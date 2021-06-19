import React from 'react';
import {io, Socket} from 'socket.io-client'
import Chat from './chat';
import DrawingBoard from './DrawingBoard';
import Header from './header';
import Players from './players';
import TimerAndWord from './TimerAndWord';


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
            <div  className='main' id = 'mainDiv'>
                <div className='headerContainer'>
                    <Header/>
                </div>
                <div>
                    <TimerAndWord />
                </div>
                <div className = 'mainContent'>
                    <Players/>
                    <DrawingBoard />
                    <Chat />
                </div>

            </div>
        )
    }
}

export default Main;