
import React from 'react'
import { drawMode } from '../typesAndInterfaces';

function min(x: number, y : number): number{
    if(x < y) return x;
    return y;
}
function max(x : number, y : number) : number{
    if(x > y) return x;
    return y;
}

function hexToRGB(hex: string) : number[] {

    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
  
    return [r, g, b]
}

interface State{

}
interface Props{
    drawMode : drawMode ;
    colorString : string;
    lineWidth : number;
    changeLineWidth : (widht : number) => void
}

type points = {
    x : number,
    y : number
}

class Canvas extends React.Component<Props, State>{

    canvasRef : React.RefObject<HTMLCanvasElement>;
    rectStartPoint : points;
    imageDataBeforeRectStart : ImageData | undefined;

    constructor(props : Props){
        super(props);
        this.canvasRef = React.createRef();
        this.rectStartPoint = {
            x : -1,
            y : -1
        };
        this.imageDataBeforeRectStart = undefined;
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
        
        return imageData[point1[0]] === imageData[point2[0]] &&  imageData[point1[1]] === imageData[point2[1]] &&  imageData[point1[2]] === imageData[point2[2]]
        && imageData[point1[3]] === imageData[point2[3]]
    }

    getColorOfAPoint(context : CanvasRenderingContext2D, canvas : HTMLCanvasElement, x : number, y : number):number[]{
        let t1 = Date.now();
        let id = context.getImageData(0, 0,canvas.width, canvas.height );
        let imageData = id.data;
        let startingColorIndex = this.getColorIndicesForCoord(x, y, canvas.width,canvas.height);

        return [imageData[startingColorIndex[0]],imageData[startingColorIndex[1]],imageData[startingColorIndex[2]],imageData[startingColorIndex[3]]];
    }

    floodFillAlgo(context : CanvasRenderingContext2D, canvas : HTMLCanvasElement, x : number, y : number, color : number[]){
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
        let width = canvas.width;
        let height = canvas.height;
        while(stack.length !== 0){
            let top : points = stack.pop()!;
            let cornerPoints : points[] = [
                {x : top.x + 1, y : top.y},{x : top.x, y : top.y + 1},
                {x : top.x - 1, y : top.y}, {x : top.x, y : top.y - 1},
                // {x : top.x + 1, y : top.y - 1},{x : top.x + 1, y : top.y + 1},
                // {x : top.x - 1, y : top.y - 1}, {x : top.x - 1, y : top.y + 1},
            ]
            for(let j = 0; j < cornerPoints.length; ++j){
                let xn = cornerPoints[j].x;
                let yn = cornerPoints[j].y;

                let indexes : number[] = [];
                if (xn < 0 || yn < 0 || xn >= width || yn >= height) indexes = [-1, -1, -1, -1];
                else{
                    let red = yn * (width * 4) + xn * 4;
                    indexes = [red, red + 1, red + 2, red + 3];
                }
                if(this.checkEqualColor(imageData, indexes , startingColorIndex) && !vis[xn][yn]){
                    stack.push(cornerPoints[j]);
                    vis[xn][yn] = true;
                    this.setNewColor(imageData, indexes, color);
                }
            }
        }
        this.setNewColor(imageData, startingColorIndex, color);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(id, 0, 0);
        let t2 = Date.now();
        console.log(t2 - t1);

    }

    handleMouseDownForPenAndEraser(context : CanvasRenderingContext2D, e : MouseEvent){
        context?.beginPath();
        if(this.props.drawMode === 'eraser'){
            context!.strokeStyle ='#ffffff';
        }
        context?.moveTo(e.offsetX, e.offsetY);
    }

    handleMouseDownPaintFill(context : CanvasRenderingContext2D,canvas :  HTMLCanvasElement, e : MouseEvent){
        let color = hexToRGB(this.props.colorString);
        this.floodFillAlgo(context!, canvas, e.offsetX, e.offsetY,color);
    }

    handleMouseDownDrawShape(context : CanvasRenderingContext2D,canvas :  HTMLCanvasElement, e : MouseEvent){
        this.rectStartPoint = {
            x : e.offsetX, y : e.offsetY
        }
        this.imageDataBeforeRectStart = context?.getImageData(0, 0, canvas.width, canvas.height);
    }

    handleCursorMovement(canvas : HTMLCanvasElement, cursor : HTMLElement, e : MouseEvent){
        let rect = canvas.getBoundingClientRect();
                    
        if(cursor){
            cursor.style.left = `${e.offsetX + + 5 + rect.left - this.props.lineWidth / 2 }px`;
            cursor.style.top = `${e.offsetY + 5 + rect.top - this.props.lineWidth / 2 }px`;
        }
    }

    handleMouseMovePenAndEraser(context : CanvasRenderingContext2D, e : MouseEvent ){
        context?.lineTo(e.offsetX, e.offsetY);
        context?.stroke();
    }

    handleMouseMoveShape(context : CanvasRenderingContext2D, canvas : HTMLCanvasElement, e : MouseEvent){
        if(this.imageDataBeforeRectStart){
            context?.clearRect(0, 0, canvas.width, canvas.height);
            context?.putImageData(this.imageDataBeforeRectStart,0, 0);
            context?.strokeRect(this.rectStartPoint.x, this.rectStartPoint.y, e.offsetX - this.rectStartPoint.x, e.offsetY - this.rectStartPoint.y);
        }
    }

    componentDidMount(){
        const canvas = this.canvasRef.current;
        let draw = false;
        let color : number[] = []
        if(canvas != null){
            
            let context = canvas.getContext('2d');
            canvas.height = canvas.clientHeight;
            canvas.width = canvas.clientWidth;

            if(context){
                context.lineWidth = this.props.lineWidth;
                context.lineCap = 'round';
                color = [255, 255, 255];
                this.floodFillAlgo(context, canvas, 0, 0, color);
                color = [0, 0, 0];
                const cursor : HTMLElement | null = document.querySelector('.cursor');
                
                canvas.addEventListener('mouseenter', e =>{
                    if(cursor){
                        cursor.style.display = 'inline';
                        cursor.style.backgroundColor = this.props.colorString;
                    }
                })
                
                canvas.addEventListener('mousemove',e=>{
                    this.handleCursorMovement(canvas, cursor!, e);
                    if(!draw || this.props.drawMode === 'paintFill') return;
                    if(this.props.drawMode === 'pen' || this.props.drawMode === 'eraser'){
                        this.handleMouseMovePenAndEraser(context!, e);
                    }
                    else if(this.props.drawMode === 'rectangle'){
                        if(this.imageDataBeforeRectStart){
                            this.handleMouseMoveShape(context!, canvas, e);
                        }
                    }
                    
                });   
                canvas.addEventListener('mousedown',e=>{
                    draw = true;
                    context!.lineWidth = this.props.lineWidth;
                    context!.strokeStyle = this.props.colorString;
                    if(this.props.drawMode === 'paintFill'){
                        this.handleMouseDownPaintFill(context!, canvas, e);
                    }
                    if(this.props.drawMode === 'pen' || this.props.drawMode === 'eraser'){
                        this.handleMouseDownForPenAndEraser(context!, e);
                    }
                    else if(this.props.drawMode === 'rectangle'){
                        this.handleMouseDownDrawShape(context!, canvas!, e);
                    }
                })
                canvas.addEventListener('mouseup',e=>{
                    draw = false;
                    context?.beginPath();
                })
                canvas.addEventListener('mouseout',e=>{
                    draw = false;
                    if(cursor){
                        cursor.style.display = 'none';
                    }
                },false);
                canvas.addEventListener('wheel', e=>{
                    if(e.deltaY > 0){
                        this.props.changeLineWidth(max(1, this.props.lineWidth - 1));
                    }
                    else{
                        this.props.changeLineWidth(min(30, this.props.lineWidth + 1));
                    }
                    if(cursor){
                        cursor.style.height = cursor.style.width = `${this.props.lineWidth}px`;
                        cursor.style.borderRadius = '50%';
                    }
                })
            }
            
            
        }
    }

    

    render() : React.ReactNode{
        return(
            <canvas className = 'canvas' ref={this.canvasRef}/>
        )
    }
}

export default Canvas;