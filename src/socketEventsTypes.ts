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