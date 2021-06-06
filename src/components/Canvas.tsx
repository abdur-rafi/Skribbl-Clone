
import * as React from 'react'

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
    drawMode : 'color' | 'fill' ;

    constructor(props : Props){
        super(props);
        this.canvasRef = React.createRef();
        this.drawMode = 'color';
    }

    getColorIndicesForCoord(x : number, y : number, width : number, height : number) : number[]{
        if (x < 0 || y < 0 || x >= width || y >= height) return [-1, -1, -1, -1];
        const red = y * (width * 4) + x * 4;
        return [red, red + 1, red + 2, red + 3];
    }

    setNewColor(imageData : Uint8ClampedArray, indexes : number[]){
        for(let i = 0; i < 2; ++i){
            imageData[indexes[i]] = 100;
        }
        imageData[indexes[3]] = 200;
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
        // let path = new Path2D();
        // path.moveTo(x, y);
        // path.lineTo(x, y);
        while(stack.length !== 0){
            let top : points = stack.pop()!;
            let upIndexes = this.getColorIndicesForCoord(top.x ,top.y + 1 , canvas.width,canvas.height);
            if(this.checkEqualColor(imageData, upIndexes , startingColorIndex) && !vis[top.x][top.y+1]){
                // console.log(upIndexes);
                stack.push({
                    x : top.x,
                    y : top.y + 1
                })
                vis[top.x][top.y + 1] = true;
                this.setNewColor(imageData, upIndexes);
            }
            let rightIndexes = this.getColorIndicesForCoord(top.x + 1 ,top.y  , canvas.width,canvas.height);
            if(this.checkEqualColor(imageData, rightIndexes , startingColorIndex) && !vis[top.x + 1][top.y]){
                // console.log(rightIndexes);
                stack.push({
                    x : top.x + 1,
                    y : top.y
                })
                vis[top.x + 1][top.y ] = true;
                this.setNewColor(imageData, rightIndexes);
            }
            let leftIndexes = this.getColorIndicesForCoord(top.x - 1 ,top.y , canvas.width,canvas.height);
            // console.log(top.x - 1,top.y);
            if(this.checkEqualColor(imageData, leftIndexes , startingColorIndex) && !vis[top.x - 1][top.y]){
                // console.log(leftIndexes);
                stack.push({
                    x : top.x - 1,
                    y : top.y 
                })
                vis[top.x - 1][top.y] = true;
                this.setNewColor(imageData, leftIndexes);
            }
            let bottomIndexes = this.getColorIndicesForCoord(top.x ,top.y - 1 , canvas.width,canvas.height);
            if(this.checkEqualColor(imageData, bottomIndexes , startingColorIndex) && !vis[top.x][top.y - 1]){
                // console.log(bottomIndexes);
                stack.push({
                    x : top.x,
                    y : top.y - 1
                })
                vis[top.x][top.y - 1] = true;
                this.setNewColor(imageData, bottomIndexes);
            }
        }
        let t2 = Date.now();
        this.setNewColor(imageData, startingColorIndex);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.putImageData(id, 0, 0);
        // console.log(t2 - t1);

    }

    componentDidMount(){
        const canvas = this.canvasRef.current;
        let draw = false;
        if(canvas != null){
            
            let context = canvas.getContext('2d');
            canvas.height = canvas.clientHeight;
            canvas.width = canvas.clientWidth;
            // let path = new Path2D();

            // path.moveTo(10, 10);
            // path.lineTo(20, 20);
            // path.lineTo(30, 40);
            // path.lineTo(20, 50);
            // path.closePath();
            // context?.fill(path);


            if(context){
                // context.fillStyle = 'green';
                // context?.fillRect(10, 10,  100, 100);
                // context.fillStyle = 'red';
                // context.fillRect(20, 20, 10, 10);
                // context.clearRect(30, 30, 40, 30);
                // context.beginPath();
                // context.moveTo(10, 10);
                // context.lineTo(201, 196);
                // context.stroke();
                // console.log(canvas.width,canvas.height)
                // context.lineTo(25, 105);
                // context.stroke();
                // context.lineTo(125, 105);
                // context.stroke();
                
                // context.closePath();
                // context.stroke();

                // context.lineTo(50, 105);
                // context.stroke();

                // context.fill();
                // console.log('drawn');
                context.lineWidth = 4;
                context.lineCap = 'round';
                
                canvas.addEventListener('mousemove',e=>{
                    if(!draw || this.drawMode != 'color') return;
                    console.log(e.offsetX);
                    context?.lineTo(e.offsetX, e.offsetY);
                    // paths[paths.length - 1].lineTo(e.offsetX, e.offsetY);
                    context?.stroke();
                });   
                canvas.addEventListener('mousedown',e=>{
                    if(this.drawMode === 'fill'){
                        this.floodFillAlgo(context!, canvas, e.offsetX, e.offsetY);
                        return;
                    }
                    draw = true;
                    context?.beginPath();
                    // paths.push(new Path2D());
                    // paths[paths.length-1].moveTo(e.offsetX, e.offsetY);
                    context?.moveTo(e.offsetX, e.offsetY);
                })
                canvas.addEventListener('mouseup',e=>{
                    draw = false;
                    context?.beginPath();
                    // context!.fillStyle = 'green';
                    // context?.fill(paths[paths.length - 1])
                    // context?.fill();
                })
                canvas.addEventListener('mouseout',e=>{
                    draw = false;
                    console.log('mouse left');
                },false)
            }
            
            
        }
    }

    render() : React.ReactNode{
        return(
            <div style={{
                display : 'flex',
                flexDirection : 'column'
            }}>
                <canvas ref={this.canvasRef} style={{
                    height : "1000px",
                    width : "1000px",
                }}/>
                <div>
                    <button title = 'color' onClick = {(e) => this.drawMode = 'color'} > Color </button>
                    <button title = 'fill' onClick = {(e) => this.drawMode = 'fill'} > Fill </button>
                </div>
            </div>
        )
    }
}

export default Canvas;