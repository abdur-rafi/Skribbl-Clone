import React , {useState, useEffect} from 'react'
import {max} from './Canvas'
import {socket } from './Home'

const Timer : React.FC<{}> = (props) =>{

    const [time, setTime ] = useState<number>(40);

    function decreaseTime(){
        // console.log(time);
        setTime(time => max(0, time - 1));
    }



    useEffect(()=>{
        const id = setInterval(decreaseTime,1000);
        socket.on('setTimer', (data)=>{
            setTime(Math.floor(data.time / 1000));
        });
        return ()=>{
            clearInterval(id);
        }
    },[])


    return(
        <div className='timerDiv'>
            {time}
        </div>
    )
}

const Round : React.FC<{}> = (props)=>{
    const [round, setRound] = useState<number>(0);
    useEffect(()=>{
        socket.on('roundNumber',data=>{
            setRound(data.round + 1);
        })
    }, []);
    return(
        <div>
            {round}
        </div>
    )
}

const TimerAndWord : React.FC<{}> = (props)=>{

    const [chosenWord, setChosenWord] = useState<string>('');

    useEffect(()=>{
        socket.on('newDrawer',data => {
            setChosenWord('');
        })

        socket.on('chosenWord', data=>{
            setChosenWord(data.word);
        })

        socket.on('chosenWordLenght',data=>{
            let gap : string = '';
            for(let i = 0; i < data.length; ++i)
                gap += '_ ';
            setChosenWord(gap);
        })
        
    }, [])

    return(
        <div className='timerAndWordContainer'>
            {/* <Round/> */}
            <Timer/>
            <div className = 'wordDivContainer'>
                <div className='wordDiv'>
                    {chosenWord}
                </div>
            </div>
            
        </div>
    )
}
export default TimerAndWord;