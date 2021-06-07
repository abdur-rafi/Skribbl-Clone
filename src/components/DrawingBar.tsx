import React from 'react'
import {BiPencil, BiEraser,BiRectangle,BiCircle,BiUpArrow} from 'react-icons/bi'
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

    selected(val : drawMode):string{

        if(this.props.drawMode === val) return ' selected';

        return '';
    }

    render() : React.ReactNode{
        return(
            <div className = 'drawingBarRoot'>
                <BiPencil className={'barItem'.concat(this.selected('pen'))} onClick = {() => this.props.changeDrawMode('pen')} />
                <RiPaintFill className={'barItem'.concat(this.selected('paintFill'))} onClick = {() => this.props.changeDrawMode('paintFill')}/>
                <input className={'barItem'} type = 'color' onChange = {(e)=>{
                    this.props.changeColor(e.target.value);
                }}  />

                <BiEraser className={'barItem'.concat(this.selected('eraser'))} onClick = {() => this.props.changeDrawMode('eraser')}/>
                <BiRectangle onClick = {()=>this.props.changeDrawMode('rectangle')} className = {'barItem'.concat(this.selected('rectangle'))} />
                <BiCircle onClick = {()=>this.props.changeDrawMode('circle')} className = {'barItem'.concat(this.selected('circle'))} />
                <BiUpArrow onClick = {()=>this.props.changeDrawMode('triangle')} className = {'barItem'.concat(this.selected('triangle'))} />
                
            </div>
           
        )
    }
}

export default DrawingBar;