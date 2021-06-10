import React, { useState } from 'react';
import DrawingBoard from './components/DrawingBoard';
import Main from './components/Main';
import {Home} from './components/Home'
import { rootStatus } from './typesAndInterfaces';



function App() {
  const [status, setStatus] = useState<rootStatus>('home');

  let comp : React.ReactNode;

  if(status === 'home'){
    comp = <Home changeStatus = {setStatus} />
  }
  else{
    comp = <Main />
  }

  return (
    <div >
      {comp}
    </div>
  );
}

export default App;
