import React from "react";
import Homepage from "../homePage/homepage";

import Footer from '../footer/footer'

const shipping_policy = () => {
    return (
        <div className="about_us_edit">
            <div className="about-us-container">
                <Homepage />
                <header className="about-us-header">
                    <h2>Bilvani Shipping Policy</h2>
                </header>
                <section className="about-us-content">
                    <div className="company-info">
                        <h2>Shipping Policy </h2>
                        <p>At Bilvani, we strive to deliver your orders efficiently and effectively. Please read our Shipping Policy carefully to understand our procedures and guidelines.</p>

                        <h3>Order Processing and Dispatch</h3>
                        <p>Once your order is processed, it will be dispatched within 2-7 business working days. Please note that delivery times may vary depending on your geographic location and the time taken by our delivery partners to deliver to your area.</p>

                        <h3>Shipping Fee</h3>
                        <p>A shipping fee will be applicable for orders below Rs 500. The shipping fee will be calculated and displayed at the time of checkout.</p>

                        <h3>Cash on Delivery (COD) Orders</h3>
                        <p>For COD orders, a non-refundable delivery fee of Rs. 200 will be applicable. This fee will be added to your total order value at the time of checkout.</p>

                        <h3>International Shipping</h3>
                        <p>We currently do not offer shipping outside India. If you have any questions or concerns about international shipping, please contact us at support@bilvani.com.</p>

                        <h3>Change of Address</h3>
                        <p>If you need to change your shipping address, please contact us at support@bilvani.com before your order has been dispatched. We will do our best to accommodate your request.</p>

                        <h3>Damaged or Tampered Products</h3>
                        <p><b>Important: </b>Customers are advised not to accept damaged or tampered products. If you receive a damaged or tampered product, please refuse to accept it and contact us immediately at support@bilvani.com. We will work with you to resolve the issue and provide a replacement or refund, as applicable.
                            By making a purchase on our website, you acknowledge that you have read, understood, and agree to our Shipping Policy.
                        </p>




                    </div>

                </section>


            </div>
            <Footer />
        </div>
    );
};

export default shipping_policy;
