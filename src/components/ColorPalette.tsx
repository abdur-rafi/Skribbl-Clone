import React from 'react';

const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00' , '#ff00ff', '#00ffff',
'#ffffff', '#000000', '#808080', '#fb5607' , '#a44a3f', '#333333','#457b9d', '#bc6c25', '#0aff99']

const ColorBlock : React.FC<{
    color : string,
    changeColor : (color : string)=>void
}> = (props)=>{
    return(
        <div className  = 'color-block' style={{
            backgroundColor : props.color
        }} onClick = {(e)=>{
            props.changeColor(props.color);
        }} > 
            
        </div>
    )

    

}

const ColorPalette : React.FC<{
    changeColor : (color : string) => void
}> = (props) => {
    return(
        <div className='color-palette'>
            {colors.map(color => <ColorBlock changeColor = {props.changeColor} color = {color} />)}
        </div>
    )
}
export default ColorPalette;