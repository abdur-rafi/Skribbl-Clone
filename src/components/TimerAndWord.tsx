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

const TimerAndWord : React.FC<{}> = (props)=>{

    const [chosenWord, setChosenWord] = useState<string>('');

    useEffect(()=>{
        socket.on('newDrawer',data => {
            setChosenWord('');
        })
        socket.on('selfDrawer', data=>{
            setChosenWord(data.words);
            // alert('You are the drawer');
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
            <Timer/>
            <div className='wordDiv'>
                {chosenWord}
            </div>
        </div>
    )
}
export default TimerAndWord;