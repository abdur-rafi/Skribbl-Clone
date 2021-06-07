
import * as React from 'react'
import Canvas from './Canvas';
import DrawingBar from './DrawingBar';
import {drawMode} from '../typesAndInterfaces'
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
            <div style={{
                display : 'flex',
                flexDirection : 'column',
                // backgroundColor : 'red',
                // justifyContent : 'center',
                alignItems : 'center',
            }}>
                <Canvas drawMode = {this.state.drawMode} colorString = {this.state.color} lineWidth = {this.state.lineWidth} changeLineWidth = {this.changeLineWidht} />
                <DrawingBar drawMode = {this.state.drawMode} color = {this.state.color} changeColor = {this.changeColor} changeDrawMode = {this.changeDrawMode} />
            </div>
        )
    }
}

export default DrawingBoard;