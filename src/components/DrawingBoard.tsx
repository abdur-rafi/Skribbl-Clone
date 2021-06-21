
import * as React from 'react'
import Canvas from './Canvas';
import DrawingBar from './DrawingBar';
import {drawMode} from '../typesAndInterfaces'
import '../Stylesheets/DrawingBar.scss'



interface props{
}
interface Props{
    drawMode : drawMode,
    color : string,
    lineWidth : number,
    changeDrawMode : (mode : drawMode) => void,
    changeColor : (color : string) => void,
    changeLineWidht : (w : number) => void,
    cursorRef : React.RefObject<HTMLDivElement>
}


class DrawingBoard extends React.Component<Props, props>{

    constructor(props: Props){
        super(props);
    }

    


    render() : React.ReactNode{
        return(
            <div className = 'DrawingBoardRoot'>
                <Canvas  drawMode = {this.props.drawMode} colorString = {this.props.color} lineWidth = {this.props.lineWidth} changeLineWidth = {this.props.changeLineWidht} />
                <DrawingBar drawMode = {this.props.drawMode} color = {this.props.color} changeColor = {this.props.changeColor} changeDrawMode = {this.props.changeDrawMode} />
                <Cursor cursorRef = {this.props.cursorRef}/>
            </div>
        )
    }
}

const Cursor : React.FC<{
    cursorRef : React.RefObject<HTMLDivElement>
}> = (props)=>{
    return(
        <div className='cursor' style={{
            height : '10px',
            width : '10px',
            borderRadius : '50%',
            backgroundColor : 'red',
            position : 'absolute',
            pointerEvents : 'none'
            
        }} ref = {props.cursorRef}>

        </div>
    )
}

export default DrawingBoard;