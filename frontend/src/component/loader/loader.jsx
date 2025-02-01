import React from 'react'
import './loader.css'

const loader = () => {
    return (
        <div className='body'>
            <div className="loader-container">
            <div className="morph-shape">
                <div className="particle" />
            </div>
            <p className="text">Loading...</p>
        </div>
        </div>
     

    )
}

export default loader
