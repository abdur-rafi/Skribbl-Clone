export type drawMode = 'pen' | 'eraser' | 'paintFill' | 'rectangle' | 'circle' | 'triangle';

export type eventAndCoord = {
    offsetX : number, 
    offsetY : number
}

export interface mouseSocketEvent{
    event : 'mousedown' | 'fill' | 'line' | 'rectangle' | 'circle' | 'triangle' ,
    offsetX : number,
    offsetY : number,
    lineWidht : number,
    color : string,
    startX? : number,
    startY? : number
}