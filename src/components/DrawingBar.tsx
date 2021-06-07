import React from 'react'
import {BiPencil, BiEraser} from 'react-icons/bi'
import {RiPaintFill} from 'react-icons/ri'
import {drawMode} from '../typesAndInterfaces'

interface State{
    
}

interface Props{
    drawMode : drawMode,
    color : string,
    changeDrawMode : (mode : drawMode) => void,
    changeColor : (color : string)=> void
}

class DrawingBar extends React.Component<Props, State>{
    constructor(props: Props){
        super(props);
    }

    render() : React.ReactNode{
        return(
            <div style={{

            }}>
                <div style={{
                    margin : '2px',
                    display : 'flex',
                    alignItems : 'center'
                }}>
                    <BiPencil style={{
                        border : 'solid 2px',
                        fontSize : 30
                    }} onClick = {() => this.props.changeDrawMode('pen')} />
                    <RiPaintFill style = {{
                        border : 'solid 2px',
                        fontSize : 30
                    }} onClick = {() => this.props.changeDrawMode('paintFill')}/>
                    <input type = 'color' style={{
                        margin : 0,
                        padding : 0,
                        height : 30,
                        width : 30
                    }} onChange = {(e)=>{
                        this.props.changeColor(e.target.value);
                    }}  />

                    <BiEraser style = {{
                        border : 'solid 2px',
                        fontSize : 30
                    }} onClick = {() => this.props.changeDrawMode('eraser')}/>

                </div>
            </div>
        )
    }
}

export default DrawingBar;