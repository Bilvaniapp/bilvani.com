import React from "react";
import Homepage from "../homePage/homepage";
import Footer from '../footer/footer';

const faqs = () => {
    return (
        <div className="about_us_edit">
            <div className="about-us-container">
                <Homepage />
                <header className="about-us-header">
                    <h2>Bilvani FAQs</h2>
                </header>
                <section className="about-us-content">
                    <div className="company-info">
                        <h4>1 : What is Bilvani? </h4>
                        <ul>
                            <li>Bilvani is your premier online destination for customized cosmetics products. Our mission is to provide high-quality lipstick and nail polish that meet the unique needs of our customers, while delivering exceptional customer service and unparalleled value.</li>
                        </ul>

                        <h4>2 : How do I create an account? </h4>
                        <ul>
                            <li>To create an account, simply click on the "Sign Up" button on our website and follow the registration process.</li>
                        </ul>

                        <h4>3 : What if I forget my password? </h4>
                        <ul>
                            <li>If you forget your password, click on the "Forgot Password" link on our website and follow the instructions to reset your password.</li>
                        </ul>

                        <h4>4 : How do I change my account information?</h4>
                        <ul>
                            <li>To change your account information, log in to your account and click on the "Account Settings" link.</li>
                        </ul>

                        <h4>5 : What forms of payment do you accept? </h4>
                        <ul>
                            <li>We accept [list accepted payment methods, e.g. credit cards, PayPal, etc.].</li>
                        </ul>

                        <h4>6 : How do I track my order? </h4>
                        <ul>
                            <li>Once your order has shipped, you will receive an email with tracking information. You can use this information to track the status of your order.</li>
                        </ul>

                        <h4>7 : What if I need to return or exchange an item? </h4>
                        <ul>
                            <li>Please see our [Return and Exchange Policy](link to policy) for instructions on how to return or exchange an item.</li>
                        </ul>

                        <h4>8 : How do I contact customer support? </h4>
                        <ul>
                            <li>You can contact our customer support team by email at support@bivani.com, or by phone at +91 99799 85557.</li>
                        </ul>

                        <h4>9 : What are your business hours? </h4>
                        <ul>
                            <li>Our business hours are Monday-Friday, 9am-5pm EST.</li>
                        </ul>

                        <h4>10 : Is my personal information secure? </h4>
                        <ul>
                            <li>Yes, we take the security of your personal information seriously. Our website uses SSL encryption to protect your data.</li>
                        </ul>

                        <h4>11 : Do you offer any discounts or promotions?</h4>
                        <ul>
                            <li>Yes, we occasionally offer discounts and promotions. Sign up for our newsletter or follow us on social media to stay informed about our latest offers.</li>
                        </ul>

                        <h4>12 : How do I know if a product is in stock? </h4>
                        <ul>
                            <li>If a product is out of stock, it will be indicated on the product page. If you have any questions about product availability, please contact our customer support team.</li>
                        </ul>

                        <h4>13 : Do you ship internationally? </h4>
                        <ul>
                            <li>Not right now launching soon, depending on the company's shipping policy. If we do ship internationally, please note that additional shipping fees and customs duties may apply.</li>
                        </ul>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default faqs;
