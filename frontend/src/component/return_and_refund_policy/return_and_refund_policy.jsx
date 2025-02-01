import React from "react";
import Homepage from "../homePage/homepage";

import Footer from '../footer/footer'

const return_and_refund = () => {
    return (
        <div className="about_us_edit">
            <div className="about-us-container">
                <Homepage />
                <header className="about-us-header">
                    <h2>Bilvani Return And Refund Policy</h2>
                </header>
                <section className="about-us-content">
                    <div className="company-info">
                        <h2>Return and Refund Policy</h2>
                        <p>At Bilvani, we strive to provide high-quality, customized products that meet your expectations. However, we understand that sometimes issues may arise. Please read our Return and Refund Policy carefully to understand our procedures and guidelines.</p>

                        <h3>No-Return Policy</h3>
                        <p>We have a no-return policy, which means we do not accept returns of any kind. All purchases made on our website are considered final.</p>

                        <h3>Damages and Issues</h3>
                        <p>Please inspect your order upon reception and contact us immediately if the item is defective, damaged, or if you receive the wrong item. We will evaluate the issue and make it right.</p>

                        <h3>Exceptions / Non-Returnable Items</h3>
                        <p>Since our products are personal beauty products, they are all non-returnable. We cannot accept returns or exchanges due to the personal nature of these products.</p>

                        <h3>Exchanges</h3>
                        <p>We do not allow for exchanges. If you have any issues with your order, please contact us and we will work with you to resolve the problem.</p>

                        <h3>Refunds</h3>
                        <p>We have a no return/no refund policy. All purchases made on our website are considered final, and we do not offer refunds under any circumstances.</p>

                        <h3>Contact Us</h3>
                        <p>If you have any questions or concerns about our Return and Refund Policy, please don't hesitate to contact us at support@bilvani.com. We're here to help.</p>
                        <p>By making a purchase on our website, you acknowledge that you have read, understood, and agree to our Return and Refund Policy.</p>


                    </div>

                </section>


            </div>
            <Footer />
        </div>
    );
};

export default return_and_refund;
