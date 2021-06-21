import React from 'react'

const nibWidths = [ 4]
for(let i = 8; i < 25; i += 4)
    nibWidths.push(i);

const NibBlock : React.FC<{
    radius : number,
    changeLineWidht : (w : number) => void
}> = (props) =>{
    return(
        <div className = 'nibBlock' onClick = {(e) => props.changeLineWidht(props.radius)}>
            <div>
                <div style={{
                    width : props.radius,
                    height : props.radius,
                    backgroundColor : 'grey',
                    borderRadius : '50%',
                    border : '2px solid black'
                }}>

                </div>
            </div>
            
        </div>
    )
}

const NibPicks : React.FC<{
    changeLineWidht : (w : number) => void
}> = (props) =>{
    return(
        <div className = 'nibPalette'>
            {nibWidths.map(r => <NibBlock changeLineWidht = {props.changeLineWidht} radius = {r} />)}
        </div>
    )
}

export default NibPicks;