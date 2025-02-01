
import React from 'react';
import './404-page.css'
import Homepage from '../homePage/homepage'

const NotFound = () => {
  return (
    <div className='container-fluidss'>
        <Homepage/>
        <img src="/404_error.webp" alt="404_image" className='img-fluid  image_notfound' />
      
    </div>
  );
}

export default NotFound;
