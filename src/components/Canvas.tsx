
import React from 'react'
import { drawMode, eventAndCoord,mouseSocketEvent } from '../typesAndInterfaces';
import {io, Socket} from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import {socket } from '../io'

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
    shapeStartPoint : points;
    imageDataBeforeRectStart : ImageData | undefined;

    constructor(props : Props){
        super(props);
        this.canvasRef = React.createRef();
        this.shapeStartPoint = {
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

    handleMouseDownForPenAndEraser(context : CanvasRenderingContext2D, e : MouseEvent | eventAndCoord, drawMode : drawMode){
        context?.beginPath();
        if(drawMode === 'eraser'){
            context!.strokeStyle ='#ffffff';
        }
        context?.moveTo(e.offsetX, e.offsetY);
    }

    handleMouseDownPaintFill(context : CanvasRenderingContext2D,canvas :  HTMLCanvasElement, e : MouseEvent | eventAndCoord , colorString : string){
        let color = hexToRGB(colorString);
        this.floodFillAlgo(context!, canvas, e.offsetX, e.offsetY,color);
    }

    handleMouseDownDrawShape(context : CanvasRenderingContext2D,canvas :  HTMLCanvasElement, e : MouseEvent | eventAndCoord){
        this.shapeStartPoint = {
            x : e.offsetX, y : e.offsetY
        }
        this.imageDataBeforeRectStart = context?.getImageData(0, 0, canvas.width, canvas.height);
    }

    handleCursorMovement(canvas : HTMLCanvasElement, cursor : HTMLElement, e : MouseEvent | eventAndCoord){
        let rect = canvas.getBoundingClientRect();
                    
        if(cursor){
            cursor.style.left = `${e.offsetX + + 5 + rect.left - this.props.lineWidth / 2 }px`;
            cursor.style.top = `${e.offsetY + 5 + rect.top - this.props.lineWidth / 2 }px`;
        }
    }

    handleMouseMovePenAndEraser(context : CanvasRenderingContext2D, e : MouseEvent | eventAndCoord){
        context?.lineTo(e.offsetX, e.offsetY);
        context?.stroke();
    }

    drawCircle(context : CanvasRenderingContext2D, x1: number, y1 : number, x2:number, y2 : number){
        context.beginPath();
        let diameter = Math.sqrt( (x1 - x2) ** 2  + (y1 - y2) ** 2)
        context.arc((x2 + x1) / 2, (y1 + y2) / 2, diameter / 2,0, Math.PI * 2);
        context.stroke();
    }

    drawTraingle(context : CanvasRenderingContext2D, x1: number, y1 : number, x2:number, y2 : number){
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.lineTo(x1 -2 * (x2 - x1) / 2, y2);
        context.closePath();
        context.stroke();
    }

    handleMouseMoveShape(context : CanvasRenderingContext2D, canvas : HTMLCanvasElement, e : MouseEvent | eventAndCoord){
        if(this.imageDataBeforeRectStart){
            context?.clearRect(0, 0, canvas.width, canvas.height);
            context?.putImageData(this.imageDataBeforeRectStart,0, 0);
            let x1 = this.shapeStartPoint.x, y1 = this.shapeStartPoint.y , x2 = e.offsetX, y2 = e.offsetY;
            if(this.props.drawMode === 'rectangle')
                context?.strokeRect(x1, y1, x2 - x1, y2 - y1);
            else if(this.props.drawMode === 'circle'){
                this.drawCircle(context, x1, y1, x2, y2);
            }
            else if(this.props.drawMode === 'triangle'){
                context.beginPath();
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                context.lineTo(x1 -2 * (x2 - x1) / 2, y2);
                context.closePath();
                context.stroke();
                // context.stroke
            }
        }
    }

    handleMouseMove(e : MouseEvent | eventAndCoord){

    }

    componentDidMount(){

        
        


        const canvas = this.canvasRef.current;
        let draw = false;
        let color : number[] = []
        if(canvas === null) return;
        let context = canvas.getContext('2d');
        if(context === null) return;
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;

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
                let socketData : mouseSocketEvent = {
                    event : 'line',
                    offsetX : e.offsetX,
                    offsetY : e.offsetY,
                    lineWidht : this.props.lineWidth,
                    color : this.props.colorString
                }
                socket.emit('drawEvent',socketData);
                this.handleMouseMovePenAndEraser(context!, e);
            }
            else if(this.props.drawMode === 'rectangle' || this.props.drawMode === 'circle' || this.props.drawMode === 'triangle'){
                if(this.imageDataBeforeRectStart){
                    this.handleMouseMoveShape(context!, canvas, e);
                }
            } 
            
        });   
        canvas.addEventListener('mousedown',e=>{
            draw = true;
            context!.lineWidth = this.props.lineWidth;
            context!.strokeStyle = this.props.colorString;
            let socketData : mouseSocketEvent ={
                event : this.props.drawMode === 'paintFill' ? 'fill' : 'mousedown',
                offsetX : e.offsetX,
                offsetY : e.offsetY,
                lineWidht : this.props.lineWidth,
                color : this.props.drawMode === 'eraser' ? '#ffffff' : this.props.colorString
            }
            socket.emit('drawEvent',socketData);
            if(this.props.drawMode === 'paintFill'){
                this.handleMouseDownPaintFill(context!, canvas, e, this.props.colorString);
            }
            if(this.props.drawMode === 'pen' || this.props.drawMode === 'eraser'){
                this.handleMouseDownForPenAndEraser(context!, e, this.props.drawMode);
            }
            else if(this.props.drawMode === 'rectangle' || this.props.drawMode === 'circle' || this.props.drawMode === 'triangle'){
                this.handleMouseDownDrawShape(context!, canvas!, e);
            }
        })
        canvas.addEventListener('mouseup',e=>{
            if(draw){
                if(this.props.drawMode === 'rectangle' || this.props.drawMode === 'triangle' || this.props.drawMode === 'circle'){
                    socket.emit('drawEvent', this.createShapeSocketEvent(e, this.props.drawMode));
                }
            }
            draw = false;
            context?.beginPath();
        })
        canvas.addEventListener('mouseout',e=>{
            if(draw){
                if(this.props.drawMode === 'rectangle' || this.props.drawMode === 'triangle' || this.props.drawMode === 'circle'){
                    this.handleMouseMoveShape(context!, canvas, e);
                    socket.emit('drawEvent', this.createShapeSocketEvent(e, this.props.drawMode));
                }
            }
            draw = false;
            if(cursor){
                cursor.style.display = 'none';
            }
        },false);
        canvas.addEventListener('wheel', e=>{
            e.preventDefault();
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
        
        socket.emit('test', {
            message : 'message'
        })

        socket.on('drawEvent', (data:mouseSocketEvent)=>{
            let e : eventAndCoord = {
                offsetX : data.offsetX,
                offsetY : data.offsetY
            }
            // console.log(data);
            if(data.event === 'fill'){
                
                this.handleMouseDownPaintFill(context!, canvas,e, data.color);
            }
            else if(data.event === 'mousedown'){
                context!.strokeStyle = data.color;
                context!.lineWidth = data.lineWidht;
                this.handleMouseDownForPenAndEraser(context!,e,'pen');
            }
            else if(data.event === 'line'){
                this.handleMouseMovePenAndEraser(context!,e);
            }
            else if(data.event === 'rectangle'){
                context!.strokeStyle = data.color;
                context?.strokeRect(data.startX!, data.startY!, data.offsetX - data.startX!, data.offsetY - data.startY!);
            }
            else if(data.event === 'circle'){
                this.drawCircle(context!, data.startX!, data.startY!, data.offsetX, data.offsetY);
            }
            else if(data.event === 'triangle'){
                this.drawTraingle(context!, data.startX!, data.startY!, data.offsetX, data.offsetY);
            }

        })

    }

    createShapeSocketEvent(e : MouseEvent, event : mouseSocketEvent['event']):mouseSocketEvent{
        return {
            event : event,
            offsetX : e.offsetX,
            offsetY : e.offsetY,
            lineWidht : this.props.lineWidth,
            color : this.props.colorString,
            startX : this.shapeStartPoint.x,
            startY : this.shapeStartPoint.y
        }
    }


    

    render() : React.ReactNode{
        return(
            <canvas className = 'canvas' ref={this.canvasRef}/>
        )
    }
}

export default Canvas;