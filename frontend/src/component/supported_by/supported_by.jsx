import React from "react";
import Homepage from "../homePage/homepage";
import "./supportedBy.css";
import Footer from "../footer/footer";

const supported_by = () => {
  return (
    <div className="about_us_edit">
      <div className="about-us-container">
        <Homepage />
        <header className="about-us-header">
          <h2>Supported By</h2>
        </header>
        <section className="about-us-content">
          <div className="company-info">
            <div>
              <h3>1.SSIP</h3>
              <img src="/SSIP.png" alt="" className="img-fluid" width="200px" />
            </div>

            <div>
              <h3>2.Startup Gujarat </h3>
              <img
                src="/startup.png"
                alt=""
                className="img-fluid"
                width="200px"
              />
            </div>
            <div>
              <h3>3.Startup India</h3>
              <img
                src="startupindia.png"
                alt=""
                className="img-fluid"
                width="200px"
              />
            </div>

            <div>
              <h3>4.Icreate </h3>
              <img
                src="icreate.png"
                alt=""
                className="img-fluid"
                width="200px"
              />
            </div>
            <div>
              <h3>Recognize by :- </h3>
              <img
                src="makerfest.png"
                alt=""
                className="img-fluid"
                width="200px"
              />
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default supported_by;
