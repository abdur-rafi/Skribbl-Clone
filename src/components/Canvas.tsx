
import * as React from 'react'
import {BiPencil, BiEraser} from 'react-icons/bi'
import {RiPaintFill} from 'react-icons/ri'

function min(x: number, y : number): number{
    if(x < y) return x;
    return y;
}
function max(x : number, y : number) : number{
    if(x > y) return x;
    return y;
}

interface State{

}
interface Props{

}

type points = {
    x : number,
    y : number
}

class Canvas extends React.Component<Props, State>{

    canvasRef : React.RefObject<HTMLCanvasElement>;
    drawMode : 'color' | 'fill' | 'erase' ;
    color : number[];
    colorString : string;
    lineWidth : number;

    constructor(props : Props){
        super(props);
        this.canvasRef = React.createRef();
        this.drawMode = 'color';
        this.color = [0, 0, 0];
        this.colorString = '#000000';
        this.lineWidth = 2;
    }

    hexToRGB(hex: string) : number[] {

        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
      
        return [r, g, b]
      }

    getColorIndicesForCoord(x : number, y : number, width : number, height : number) : number[]{
        if (x < 0 || y < 0 || x >= width || y >= height) return [-1, -1, -1, -1];
        const red = y * (width * 4) + x * 4;
        return [red, red + 1, red + 2, red + 3];
    }

    setNewColor(imageData : Uint8ClampedArray, indexes : number[] , colors : number[]){
        for(let i = 0; i < 3; ++i){
            imageData[indexes[i]] = colors[i];
        }
        imageData[indexes[3]] = 255;
    }

    checkEqualColor(imageData : Uint8ClampedArray, point1: number[], point2 : number[]): boolean{
        
        return imageData[point1[0]] == imageData[point2[0]] &&  imageData[point1[1]] == imageData[point2[1]] &&  imageData[point1[2]] == imageData[point2[2]]
        && imageData[point1[3]] == imageData[point2[3]]
    }

    floodFillAlgo(context : CanvasRenderingContext2D, canvas : HTMLCanvasElement, x : number, y : number){
        let t1 = Date.now();
        let id = context.getImageData(0, 0,canvas.width, canvas.height );
        let imageData = id.data;
        let startingColorIndex = this.getColorIndicesForCoord(x, y, canvas.width,canvas.height);

        let vis:Array<Array<boolean>> = new Array<Array<boolean>>(canvas.width);
        for(let i = 0; i < vis.length ; ++i){
            vis[i] = new Array(canvas.height);
            for(let j = 0; j < vis[i].length; ++j)
                vis[i][j] = false;
        }

        let stack: points[] = [];
        stack.push({
            x : x,
            y : y
        })
        vis[x][y] = true;
        while(stack.length !== 0){
            let top : points = stack.pop()!;
            let cornerPoints : points[] = [
                {x : top.x + 1, y : top.y},{x : top.x, y : top.y + 1},
                {x : top.x - 1, y : top.y}, {x : top.x, y : top.y - 1},
                {x : top.x + 1, y : top.y - 1},{x : top.x + 1, y : top.y + 1},
                {x : top.x - 1, y : top.y - 1}, {x : top.x - 1, y : top.y + 1},
            ]
            for(let j = 0; j < cornerPoints.length; ++j){
                let xn = cornerPoints[j].x;
                let yn = cornerPoints[j].y;
                let indexes = this.getColorIndicesForCoord(xn, yn, canvas.width, canvas.height);
                if(this.checkEqualColor(imageData, indexes , startingColorIndex) && !vis[xn][yn]){
                    stack.push(cornerPoints[j]);
                    vis[xn][yn] = true;
                    this.setNewColor(imageData, indexes, this.color);
                }
            }
        }
        this.setNewColor(imageData, startingColorIndex, this.color);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(id, 0, 0);
        let t2 = Date.now();
        console.log(t2 - t1);

    }

    componentDidMount(){
        const canvas = this.canvasRef.current;
        let draw = false;
        if(canvas != null){
            
            let context = canvas.getContext('2d');
            canvas.height = canvas.clientHeight;
            canvas.width = canvas.clientWidth;

            if(context){
                context.lineWidth = this.lineWidth;
                context.lineCap = 'round';
                this.color = [255, 255, 255];
                this.floodFillAlgo(context, canvas, 0, 0);
                this.color = [0, 0, 0];
                
                canvas.addEventListener('mousemove',e=>{
                    if(!draw || this.drawMode == 'fill') return;
                    context?.lineTo(e.offsetX, e.offsetY);
                    context?.stroke();
                    
                });   
                canvas.addEventListener('mousedown',e=>{
                    if(this.drawMode === 'fill'){
                        this.floodFillAlgo(context!, canvas, e.offsetX, e.offsetY);
                        return;
                    }
                    draw = true;
                    context!.lineWidth = this.lineWidth;
                    context?.beginPath();
                    context!.strokeStyle = this.drawMode === 'color'? this.colorString : '#ffffff';
                    context?.moveTo(e.offsetX, e.offsetY);
                })
                canvas.addEventListener('mouseup',e=>{
                    draw = false;
                    context?.beginPath();
                })
                canvas.addEventListener('mouseout',e=>{
                    draw = false;
                    console.log('mouse left');
                },false)
                canvas.addEventListener('wheel', e=>{
                    console.log('wheel');
                    console.log(e.deltaY);
                    if(e.deltaY > 0){
                        this.lineWidth = max(1, this.lineWidth - 1);
                    }
                    else{
                        this.lineWidth = min(12, this.lineWidth + 1);
                    }
                })
            }
            
            
        }
    }

    render() : React.ReactNode{
        return(
            <div style={{
                display : 'flex',
                flexDirection : 'column',
                // backgroundColor : 'red',
                // justifyContent : 'center',
                alignItems : 'center'
            }}>
                <canvas ref={this.canvasRef} style={{
                    height : "800px",
                    width : "800px",
                    borderWidth : '2px',
                    border : 'solid'
                }}/>
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
                        }} onClick = {() => this.drawMode = 'color'} />
                        <RiPaintFill style = {{
                            border : 'solid 2px',
                            fontSize : 30
                        }} onClick = {() => this.drawMode = 'fill'}/>
                        <input type = 'color' style={{
                            margin : 0,
                            padding : 0,
                            height : 30,
                            width : 30
                        }} onChange = {(e)=>{
                            this.color = this.hexToRGB(e.target.value);
                            this.colorString = e.target.value;
                        }}  />

                        <BiEraser style = {{
                            border : 'solid 2px',
                            fontSize : 30
                        }} onClick = {() => this.drawMode = 'erase'}/>

                    </div>
                </div>
            </div>
        )
    }
}

export default Canvas;