import React from 'react';
import { Tilt } from 'react-tilt';
import './Logo.css';
import brain from './brain.png';



const Logo = () => {
    return(
        <div className='ma4 mt0'>
        <Tilt className="Tilt br2 shadow-2" options={{ max : 55 }} style={{ height: 75, width: 75 }} >
    <div className="Tilt-inner pa-3"> 
        <img style={{paddingTop:'5px'}} src={brain} alt='logo'></img> </div>
    </Tilt>
        </div>
    );
}

export default Logo;
