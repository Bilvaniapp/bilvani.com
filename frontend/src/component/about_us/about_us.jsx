import React from "react";
import Homepage from "../homePage/homepage";
import "./aboutus.css";
import Footer from '../footer/footer'

const AboutUs = () => {
  return (
    <div className="about_us_edit">
      <div className="about-us-container">
        <Homepage />
        <header className="about-us-header">
          <h1>About Us</h1>
        </header>
        <section className="about-us-content">
          <div className="company-info">
            <h2>Welcome to Bilvani: Where Beauty Meets Customization</h2>
            <p>
              At Bilvani, we're on a mission to revolutionize the way you experience beauty. We believe that every individual is unique, and their beauty products should be too. That's why we're dedicated to providing handmade, customized cosmetics that cater to your specific needs and preferences.
            </p>

            <h3>Our Story</h3>
            <p>
              Bilvani was born out of a simple yet profound realization: why should you have to settle for a "nearby" shade when you can have the exact one you want? Our founder, <b>Harshvardhan Paida</b>, a mechanical engineer with a passion for innovation, designed a customized cosmetics machine that makes it possible to create products tailored to your individuality.
            </p>

            <h3>Our Mission</h3>
            <p>At Bilvani, our mission is to empower you to take control of your beauty routine. We believe that you should be able to choose the exact shade, base, and fragrance that makes you feel confident and beautiful. Our goal is to provide high-quality, handmade products that not only meet but exceed your expectations.</p>

            <h3>What Sets Us Apart</h3>
            <p>Unlike other beauty companies, we don't believe in a "one-size-fits-all" approach. We're committed to delivering products that are tailored to your unique preferences. With Bilvani, you're not limited to choosing from a pre-existing range of shades. Instead, you can create your own customized products that reflect your personality and style.</p>

            <h3>Meet Our Founder</h3>
            <p><b>Harshvardhan Paida</b>, our founder and CEO, is a mechanical engineer with a passion for innovation. His vision for Bilvani is to create a brand that truly listens to its customers and delivers products that exceed their expectations.</p>

            <h3>Our Products</h3>
            <p>We offer a range of customized products, including lipsticks, nail polishes, lip care, and nail care products. What sets our products apart is the level of customization we offer. You can choose from a wide range of shades, bases, and fragrances to create a product that's truly unique to you.</p>

            <h3>Awards and Recognition</h3>
            <p>We're proud to have been recognized at Makefest Vadodara 2022, a testament to our commitment to innovation and customer satisfaction.</p>

            <h3>Join the Bilvani Family</h3>
            <p>At Bilvani, we're more than just a beauty company. We're a community of individuals who believe in the power of customization and self-expression. Join us on this journey, and discover a world of beauty that's tailored to your unique needs and preferences.
              I hope you like it! Let me know if there's anything you'd like to change or if you have any feedback.
            </p>


          </div>

        </section>


      </div>
      <Footer />
    </div>
  );
};

export default AboutUs;
