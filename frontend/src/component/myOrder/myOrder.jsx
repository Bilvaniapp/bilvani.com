import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../helper/helper';
import HomePage from '../homePage/homepage';
import './myOrder.css';
import Loader from '../loader/loader';
import Footer from '../footer/footer';

const formatDateToIST = (dateString) => {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata'
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', options).format(date);
};

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch product data using the correct API route
                const response = await axios.get(`${BASE_URL}/api/bilvani/fetch/data/user`, { withCredentials: true });
    
                if (response.status === 200 && response.data.success) {
                    setOrders(response.data.data); 
                } else {
                    setOrders([]); 
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchOrders();
    }, []);
    

    if (loading) return <><Loader /></>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className='order-my-user'>
            <HomePage />
            <div className="container">
                <div className='order-display-container'>
                    <h2>My Orders</h2>
                    {orders.length === 0 ? (
                        <div className="no-orders">
                            <img src='/no-order-image.png' alt="No Orders" className="no-orders-image img-fluid" />
                            <p className="no-orders-message">My Order is Empty</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order._id} className="order-card">
                                        <div className="products">
                                            <div 
                                                className="product-card"
                                                key={order._id}
                                                // onClick={() => {
                                                   // window.location.href = `/view-custom-order/exploreOrder==true&refrence==Bilvani/${order._id}`;
                                                    
                                                //}}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="product-left">
                                                    <div className="color-background-order" 
                                                        style={{ backgroundColor: order.mixColor || '#fff', width:"100px", padding:""}}
                                                    >
                                                        <p>Custom Shade</p>
                                                    </div>
                                                    <p className="product-title-order">{order.name}</p>
                                                </div>
                                                <div className="product-middle">
                                                    <p className="product-price"><span>Price: ₹</span>{order.totalPrice}</p>
                                                </div>
                                                <div className="product-right">
                                                    <p className="order-status">{order.orderStatus}</p>
                                                    <p className='indian-time-zone'>{formatDateToIST(order.createdAt)}</p>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Orders;
