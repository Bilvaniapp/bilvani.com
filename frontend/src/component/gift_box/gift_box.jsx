import React, { useState, useEffect } from "react";
import "./giftbox.css";

const GiftBox = () => {
  const [animationEnded, setAnimationEnded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationEnded(true);
    }, 5000); // 5 seconds (match the duration of the animation)
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="gift-box-container">
      {!animationEnded && (
        <div className="gift-box">
          <img src="/gift.jpg" alt="Gift Box" />
        </div>
      )}
      {animationEnded && (
        <div className="welcome-message">
          Welcome to Bilvani
        </div>
      )}
    </div>
  );
};

export default GiftBox;
