import React from 'react';
import {io, Socket} from 'socket.io-client'
import { drawMode } from '../typesAndInterfaces';
import Chat from './chat';
import ColorPalette from './ColorPalette';
import DrawingBoard from './DrawingBoard';
import Header from './header';
import NibPicks from './PenNib';
import Players from './players';
import TimerAndWord from './TimerAndWord';


interface State{
    drawMode : drawMode,
    color : string,
    lineWidth : number
}

interface Props{

}



class Main extends React.Component<Props, State>{

    cursorRef : React.RefObject<HTMLDivElement>

    constructor(props : Props){
        super(props);
        this.state = {
            drawMode : 'pen',
            color : '#000000',
            lineWidth : 10
        }
        this.cursorRef = React.createRef();
        this.changeDrawMode = this.changeDrawMode.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.changeLineWidht = this.changeLineWidht.bind(this);
    }

    changeDrawMode(mode:drawMode){
        this.setState({
            drawMode : mode
        })
    }

    changeColor(color : string){
        this.setState({
            color : color
        })
    }

    changeLineWidht(width : number){
        this.setState({
            lineWidth : width
        }, ()=>{
            if(this.cursorRef.current){
                this.cursorRef.current.style.height = this.cursorRef.current.style.width = `${this.state.lineWidth}px`;
                this.cursorRef.current.style.borderRadius = '50%';
            }
        })
        
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
                    <div>
                        <Players />
                        <ColorPalette changeColor = {this.changeColor} />
                    </div>
                    {/* <Players/> */}
                    <DrawingBoard cursorRef = {this.cursorRef} changeColor={this.changeColor} changeDrawMode = {this.changeDrawMode} changeLineWidht = {this.changeLineWidht}
                    color = {this.state.color} drawMode = {this.state.drawMode} lineWidth = {this.state.lineWidth} />
                    <div>
                        <Chat />
                        <NibPicks changeLineWidht = {this.changeLineWidht} />
                    </div>
                   
                </div>

            </div>
        )
    }
}

export default Main;