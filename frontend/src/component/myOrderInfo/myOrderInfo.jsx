import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../helper/helper';
import { useParams } from 'react-router-dom';
import './myOrderInfo.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import HomePage from '../homePage/homepage';
import Modal from 'react-modal';


Modal.setAppElement('#root');

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelError, setCancelError] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [additionalDetails, setAdditionalDetails] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/get-order-confrim-id/${orderId}`, { withCredentials: true });
                setOrder(response.data.order);
            } catch (err) {
                setError(err.response ? err.response.data.error : 'Error fetching order details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    const generateInvoice = () => {
        if (!order) return;

        const doc = new jsPDF({ orientation: 'portrait' });

        // Add logo image and address side by side
        const logo = new Image();
        logo.src = '/Logo.png';
        doc.addImage(logo, 'PNG', 10, 10, 30, 40);

        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('BILVANI', 80, 20);
        doc.setFont('Helvetica', 'normal');
        doc.text('GSTIN: GST-1234567890', 80, 30);
        doc.text('Address: [Company Address]', 80, 40);

        // Invoice number and date of order on 2nd row, 1st column
        doc.setFontSize(12);
        doc.text(`Invoice Number: ${order.orderId}`, 10, 50);
        doc.text(`Date of Order: ${new Date(order.date).toLocaleDateString()}`, 10, 60);

        // Customer name and address on 1st row, 2nd column
        doc.text('Customer Name:', 140, 20);
        doc.text(`${order.customerFirstName}`, 140, 30);
        doc.text(`Address: ${order.address}, ${order.district}, ${order.state} - ${order.pincode}`, 140, 40);
        doc.text(`Phone Number: ${order.phoneNumber}`, 140, 50);

        // Table columns for product details
        const tableColumn = ["Product Title", "Quantity", "Gross Price"];
        const tableRows = [];

        let totalQuantity = 0;

        order.products.forEach(product => {
            const quantity = order.quantity || product.quantity;
            const productData = [
                product.title,
                ` ${quantity}`,
                ` ${product.discountedPrice}`
            ];
            tableRows.push(productData);
            totalQuantity += quantity;
        });

        doc.autoTable({
            startY: 70,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [22, 160, 133] },
            styles: { halign: 'center', font: 'Helvetica', fontSize: 12 },
            columnStyles: {
                0: { halign: 'left' },
                1: { halign: 'right' },
            },
        });

        // Total amount
        doc.setFontSize(14);
        doc.text(`Total Quantity: ${totalQuantity}`, 10, doc.previousAutoTable.finalY + 10);
        doc.text(`Total Amount: ₹${order.products.reduce((total, product) => total + product.discountedPrice, 0)}`, 10, doc.previousAutoTable.finalY + 20);

        // Footer
        doc.setFontSize(10);
        doc.text('Thank you for your purchase! Visit Again BILVANI', 105, doc.previousAutoTable.finalY + 30, null, null, 'center');

        // Save the PDF
        doc.save(`Bilvani_Invoice_${order.orderId}.pdf`);
    };

    
    
    
    

    const cancelOrder = async () => {
        setCancelLoading(true);
        setCancelError(null);

        try {
            await axios.post(`${BASE_URL}/cancel-order`, {
                originalOrderId: orderId,
                reason: cancelReason,
                additionalDetails: additionalDetails
            }, { withCredentials: true });

            setOrder(prevOrder => ({
                ...prevOrder,
                status: 'cancelled'
            }));

            alert('Order has been cancelled successfully.');
            setModalIsOpen(false);  // Close modal on success
        } catch (err) {
            setCancelError(err.response ? err.response.data.error : 'Error cancelling the order.');
        } finally {
            setCancelLoading(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;



    
    return (
        <div className='order-details-full'>
            <HomePage />
            <div className='order-details-container container'>
                {order ? (
                    <div>
                        <h3 className='section-title'>Delivery Address</h3>
                        <p>{order.customerFirstName}</p>
                        <p className="address">{`${order.address}, ${order.district}, ${order.state} - ${order.pincode}`}</p>
                        <p>Phone Number : {order.phoneNumber}</p>
                        <p>Order ID: {order.orderId}</p>
                        <p>Order Status: {order.status}</p>
                        

                        <h2 className='section-title ipad_device'>Products:</h2>
                        <div className='products-container'>
                            {order.products.map(product => (
                                <div className='product-card-full-order' key={product._id}>
                                    <img className="product-image-full" src={product.images[0]} alt={product.name} />
                                    <div className='product-infossss'>
                                        <p className='product-titlessss'>{product.name}</p>
                                        <p className='product-pricesssss'>Price: ₹{product.discountedPrice}</p>
                                        <p>Quantity : {order.quantity}{product.quantity} </p>
                                        
                                        
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={generateInvoice} className='download-invoice-btn'>Download Invoice</button>
                        {order.status !== 'cancelled' && (
                            <button onClick={() => setModalIsOpen(true)} className='cancel-order-btn btn' disabled={cancelLoading}>
                                {cancelLoading ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                        )}
                        {cancelError && <p className='error'>{cancelError}</p>}

                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={() => setModalIsOpen(false)}
                            contentLabel="Cancel Order Modal"
                            className="Modal"
                            overlayClassName="Overlay"
                        >
                            <h2>Confirm Cancellation</h2>
                            <p>Are you sure you want to cancel this order?</p>
                            <form onSubmit={(e) => { e.preventDefault(); cancelOrder(); }}>
                                <label>
                                    Reason for Cancellation:
                                    <input 
                                        type="text" 
                                        value={cancelReason} 
                                        onChange={(e) => setCancelReason(e.target.value)} 
                                        required 
                                    />
                                </label>
                                <label>
                                    Additional Details:
                                    <textarea 
                                        value={additionalDetails} 
                                        onChange={(e) => setAdditionalDetails(e.target.value)} 
                                    />
                                </label>
                                <button type="submit" disabled={cancelLoading}>
                                    {cancelLoading ? 'Cancelling...' : 'Yes, Cancel Order'}
                                </button>
                                <button type="button" onClick={() => setModalIsOpen(false)}>No, Go Back</button>
                            </form>
                        </Modal>
                    </div>
                ) : (
                    <p>No order details available.</p>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
