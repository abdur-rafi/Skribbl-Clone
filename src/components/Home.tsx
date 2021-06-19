import React, {useState} from 'react';
import {io, Socket} from 'socket.io-client'
import * as constants from '../constants';
import { rootStatus } from '../typesAndInterfaces';

let socket : Socket;

function joinRoom(userName : string){
    console.log(constants.DEVELOPMENT);
    console.log(constants.DEVELOPMENT ? constants.localUrl : constants.serverUrl );
    socket = io(constants.DEVELOPMENT ? constants.localUrl : constants.serverUrl , {
        transports : ['websocket'],
        query : {
            userName : userName
        }
    });
}

const Home : React.FC<{
    changeStatus : (status : rootStatus)=>void
}> = (props) =>{

    const [value, setValue] = useState<string>('');


    return (
        <div>
            <input type='text' value={value} onChange = {(e) => setValue(e.target.value)} />
            <button onClick = {e => {
                if(value.length < 3){

                }
                else{
                    joinRoom(value);
                    props.changeStatus('canvas');
                }
            }} > Join Room </button>
        </div>
    )
}

export {Home, socket};