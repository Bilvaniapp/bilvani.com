const express = require("express");
const app = express();
const multer = require('multer');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const body = require('body-parser');


require("dotenv").config();

app.use(bodyParser.json());
app.use(cookieParser());

////! All import of the Mongodb
require('./mongodb/config');
require('./mongodb/signupMongo/signupMongo');
require('./mongodb/savedMixColorMongo/saveMixeColorMongo');
require('./mongodb/otpSave/otpSave');
require('./mongodb/userOrderInfo/userOrderInfoMongo');
require('./mongodb/contactUsMongo/contactUsMongo');
require('./mongodb/productMongo/productMongo');
require('./mongodb/paymentMongo/paymentMongo');
require('./mongodb/addToCartMongo/addToCartMongo');
require('./mongodb/orderConfirmMongo/orderConfirmMongo');
require('./mongodb/cancelOrderMongo/cancelOrderMongo');
require('./mongodb/productCategory/productCategoryMongo');
require('./mongodb/customColorOrderMongo/customColorOrderMongo');


////! Admin Mongodb
require('./mongodb/admin_Side/admin-sign-Mongo/admin-sign-Mongo');
require('./admin_Monogdb/adminClientMongo/adminClientMongo');
require('./mongodb/admin_Side/setCategoryShadeMongo/setCategoryShadeMongo');
require('./mongodb/admin_Side/couponCodeGenMongo/couponCodeGenMongo');
require('./admin_Monogdb/adminDashboard/NewInvoice/newInvoiceMongo');
require('./admin_Monogdb/admin-SupplierMongo/admin-SupplierMongo');
require('./admin_Monogdb/adminDashboard/addPurchase/addPurchaseMongo');
require('./admin_Monogdb/adminDashboard/addExpense/addExpense');
require('./admin_Monogdb/adminDashboard/addPaymentIn/addPayemntIn');
require('./admin_Monogdb/adminDashboard/addPaymentOut/addPaymentOut');
require('./admin_Monogdb/codOtpMongo/codOtp');
require('./admin_Monogdb/customOrderProductMongo/customOrderProductMongo');
require('./admin_Monogdb/storeOrder/storeOrderMongo');
require('./admin_Monogdb/adminDashboard/addstaff/addstaffMongo');

app.use(cors({
    origin: function (origin, callback) {
       
        if (!origin) return callback(null, true);
        return callback(null, origin);
    },
    credentials: true,
}));
app.use(body.json())


/////! All routes import 
const colorCodeApi = require('./routes/color_code_api/color_code_api');
const signupController = require('./routes/signupRoutes/signupRoutes');
const signinController = require('./routes/signinRoutes/signinRoutes');
const saveMixColors = require('./routes/saveMixColorRoutes/saveMixColorRoutes');
const verifyEmail = require('./routes/verifyEmail/verifyEmail');
const resendOTP = require('./routes/resendOtp/resendOtp');
const Orderinfo = require('./routes/orderInfoRoute/orderInfoRoute');
const Contact = require('./routes/contactUsRoutes/contactUsRoutes');
const Product = require('./routes/productRoutes/productRoutes');
const payment = require('./routes/paymentRoutes/paymentRoutes');
const addToCart = require('./routes/addToCartRoutes/addToCartRoutes');
const orderConfirmed = require('./routes/orderConfirmRoutes/orderConfirmRoutes');
const cancelOrder = require('./routes/cancelOrderRoutes/cancelOrderRoutes');
const forgotPassword = require('./routes/forgetPasswordRoutes/forgetPasswordRoutes');
const userSignUpInfoControl = require('./routes/userSignUpInfoRoutes/userSignUpInfoRoutes');
const createCategorySubcategory =  require('./routes/productCategorySubcategory/productCategorySubcategoryRoutes');

const CustomColorOrder = require('./routes/customColorOrderRoutes/customColorOrderRoutes');


////! Admin Routes

const adminsignup = require('./routes/admin_Side/admin-sign-Route/admin-signRoutes');
const verifyAdminSignup = require('./routes/admin_Side/admin-sign-Route/verifyRoutes');
const adminlogin = require('./routes/admin_Side/admin-loginRoutes/admin-loginRoutes');
const AddClinet = require('./admin_routes/adminClientRoute/adminClientRoute');
const AdminClientForget = require('./admin_routes/adminClientRoute/forgetPassword/forgetPasswordRoute');
const AddInvoice = require('./admin_routes/adminDashboard/adminInvoice/newInvoiceRoute');
const adminSupplier = require('./admin_routes/admin-SupplierRoutes/admin-SupplierRoutes');
const setCategoryShade = require('./routes/admin_Side/setCategoryShadeRoutes/setCategoryShadeRoutes');
const CouponCode = require('./routes/admin_Side/couponCodeGenRoutes/couponCodeGenRoutes');
const Purchase = require('./admin_routes/adminDashboard/addPurchase/addPurchaseRoutes');
const Expense = require('./admin_routes/adminDashboard/addExpense/addExpense');
const PaymentIN = require('./admin_routes/adminDashboard/addPaymentIn/addPayemntIn');
const PaymentOut = require('./admin_routes/adminDashboard/addPaymentOut/addPaymentOut');
const CustomOrderProduct = require('./admin_routes/customOrderProduct/customOrderProductRoute');
const StoreOrder = require('./admin_routes/storeOrderRoute/storeOrderRoute');
const StaffManage = require('./admin_routes/adminDashboard/addStaff/addStaffroute')

////! End 

// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../frontend/public/uploads')); // Save files to the correct folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename with timestamp
    }
});
const upload = multer({ storage: storage });


app.use('/create-product', upload.array('images', 3), Product);
app.use('/api/category/shade', upload.array('images', 2), setCategoryShade);

app.use("/",Contact)
app.use('/', colorCodeApi);
app.use('/sign-up', signupController);
app.use('/sign-in', signinController)
app.use('/', saveMixColors);
app.use('/verify-email', verifyEmail);
app.use('/resend-otp', resendOTP);
app.use('/', Orderinfo);
app.use('/',payment);
app.use('/', addToCart);
app.use('/',orderConfirmed);
app.use('/',cancelOrder);
app.use('/',forgotPassword);
app.use('/',userSignUpInfoControl);
app.use('/', createCategorySubcategory);
app.use('/', CouponCode);
app.use('/', CustomColorOrder);



////! Admin
app.use('/', adminsignup);
app.use('/',verifyAdminSignup);
app.use('/',adminlogin)
app.use('/', AddClinet);
app.use('/', AdminClientForget);
app.use('/', AddInvoice);
app.use('/', adminSupplier);
app.use('/', Purchase);
app.use('/', Expense);
app.use('/', PaymentIN);
app.use('/', PaymentOut);
app.use('/', CustomOrderProduct);
app.use('/', StoreOrder)






const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is starting on port ${PORT}`);
});
