import React from "react";
import Homepage from "../homePage/homepage";

import Footer from '../footer/footer'

const refund = () => {
    return (
        <div className="about_us_edit">
            <div className="about-us-container">
                <Homepage />
                <header className="about-us-header">
                    <h2>Bilvani Privacy Policy</h2>
                </header>
                <section className="about-us-content">
                    <div className="company-info">
                        <h2>Privacy Policy</h2>
                        <p>At Bilvani, we value your trust and respect your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you visit our website, use our services, or interact with us in any way.</p>

                        <h3>What Information We Collect</h3>
                        <ul>
                            <li>We collect personal information that you provide to us, including:</li>
                            <li>Contact information: name, email address, phone number, and physical address</li>
                            <li>Account information: username, password, and other login credentials</li>
                            <li>Payment information: credit card numbers, expiration dates, and billing addresses</li>
                            <li>Product preferences: customized product details, including shade, base, and fragrance choices</li>
                            <li>Communication records: emails, chats, and other interactions with our customer support team</li>
                        </ul>

                        <h5>We also collect non-personal information, such as:</h5>
                        <ul>
                            <li>Browser type and version</li>
                            <li>Operating system</li>
                            <li>Device type</li>
                            <li>IP address</li>
                            <li>Referring URL</li>
                            <li>Pages visited on our website</li>
                        </ul>


                        <h3>How We Use Your Information</h3>
                        <p>We use your personal information to:</p>
                        <ul>
                            <li>Process and fulfill your orders</li>
                            <li>Provide customer support and respond to your inquiries</li>
                            <li>Personalize your experience on our website and tailor our services to your needs</li>
                            <li>Communicate with you about new products, promotions, and updates</li>
                            <li>Improve our products and services through data analysis and research</li>
                        </ul>

                        <p>We do not sell, rent, or trade your personal information with third parties for their marketing purposes. We may share your information with our trusted partners and service providers who help us operate our business, but only to the extent necessary to provide our services.</p>

                        <h3>How We Protect Your Information</h3>
                        <p>We take the security of your personal information seriously and implement various measures to protect it, including:</p>

                        <ul>
                            <li>Encryption: We use SSL encryption to protect your data during transmission.</li>
                            <li>Access controls: We restrict access to your personal information to authorized personnel only.</li>
                            <li>Data backups: We regularly back up our data to prevent loss or corruption.</li>
                            <li>Secure servers: We store your data on secure servers protected by firewalls and intrusion detection systems</li>
                        </ul>

                        <h3>Your Rights and Choices</h3>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access and correct your personal information</li>
                            <li>Request deletion of your personal information</li>
                            <li>Object to our processing of your personal information</li>
                            <li>Request a copy of your personal information in a portable format</li>

                        </ul>
                        <p>You can exercise these rights by contacting our customer support team at support@bilvani.com</p>

                        <h3>Changes to This Policy</h3>
                        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any significant changes by posting a notice on our website or sending you an email.</p>

                        <h3>Contact Us</h3>
                        <p>If you have any questions, concerns, or feedback about our Privacy Policy, please don't hesitate to contact us at support@bilvani.com.</p>
                        <p>
                            By using our website, services, or interacting with us in any way, you consent to the collection, use, and disclosure of your personal information as described in this Privacy Policy.
                        </p>






                    </div>

                </section>


            </div>
            <Footer />
        </div>
    );
};

export default refund;
