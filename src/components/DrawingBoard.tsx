
import * as React from 'react'
import Canvas from './Canvas';
import DrawingBar from './DrawingBar';
import {drawMode} from '../typesAndInterfaces'
import '../Stylesheets/DrawingBar.scss'
interface State{
    drawMode : drawMode,
    color : string,
    lineWidth : number
}
interface Props{

}


class DrawingBoard extends React.Component<Props, State>{


    constructor(props: Props){
        super(props);
        this.state = {
            drawMode : 'pen',
            color : '#000000',
            lineWidth : 3
        }
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
        })
    }

    componentDidMount(){
    }

    render() : React.ReactNode{
        return(
            <div className = 'DrawingBoardRoot'>
                <Canvas drawMode = {this.state.drawMode} colorString = {this.state.color} lineWidth = {this.state.lineWidth} changeLineWidth = {this.changeLineWidht} />
                <DrawingBar drawMode = {this.state.drawMode} color = {this.state.color} changeColor = {this.changeColor} changeDrawMode = {this.changeDrawMode} />
                <Circle/>
            </div>
        )
    }
}

const Circle : React.FC<{}> = (props)=>{
    return(
        <div className='cursor' style={{
            height : '40px',
            width : '40px',
            borderRadius : '50%',
            backgroundColor : 'red',
            position : 'absolute',
            pointerEvents : 'none'
            
        }}>

        </div>
    )
}

export default DrawingBoard;