export interface sendImageData{
    to : string
}

export interface drawerImageData{
    imageData : string,
    to : string
}

export type player = {
    socketId : string,
    userName : string
}

export type member = {
    socketId : string,
    score : number,
    userName : string
}