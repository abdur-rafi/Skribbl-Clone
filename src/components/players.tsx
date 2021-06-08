import React from 'react';

interface State{

}

interface Props{

}

class Players extends React.Component<Props, State>{
    constructor(props : Props){
        super(props);

    }

    render():React.ReactNode{
        return(
            <div className = 'players-bar'>
                Players
            </div>
        )
    }
}

export default Players;