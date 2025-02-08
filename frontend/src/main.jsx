import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import MixedColor from "./component/mixedColor/mixedColor.jsx";
import CustomSaveColor from "./component/customSaveColor/customSaveColor.jsx";
import Signup from "./component/signup/signup.jsx";
import Signin from "./component/sigin/signin.jsx";
import PrivateRoute from "./component/private/private.jsx";
import PrivateRouteSignup from "./component/private/privateSignup-Signin/privateSignup-Signin.jsx";
import HomePageFullProduct from "./component/homePageFullProduct/homePageFullProduct.jsx";
import AddtoCard from "./component/addtoCard/addtoCard.jsx";
import SelectedColor from "./component/selectedColor/selectedColor.jsx";
import SingleProductAddress from "./component/singleProductAddress/singleProductAddress.jsx";
import MyProfile from "./component/myProfile/myProfile.jsx";
import MyOrder from "./component/myOrder/myOrder.jsx";
import MyOrderInfo from "./component/myOrderInfo/myOrderInfo.jsx";
import NotFound from "./component/404_page/404-page.jsx";
import AboutUs from "./component/about_us/about_us.jsx";
import Footer from "./component/footer/footer.jsx";
import GiftBox from "./component/gift_box/gift_box.jsx";

import CustomColorOrder from "./component/customColorOrder/customColorOrder.jsx";

import OrderDetailsColor from "./component/myOrderInfoColor/myOrderInfoColor.jsx";

import SelectedCategorytoColor from "./component/selectedCategorytoColor/selectedCategorytoColor.jsx";

import Refund from "./component/refund_policy/refund_policy.jsx";
import Return_and_refund from "./component/return_and_refund_policy/return_and_refund_policy.jsx";
import Shipping_policy from "./component/shipping_policy/shipping_policy.jsx";
import Terms_and_conditions from "./component/terms_and_conditions/terms_and_conditions.jsx";
import Faqs from "./component/FAQs/FAQs.jsx";
import Supported_by from "./component/supported_by/supported_by.jsx";

import ShopList from "./component/shop/shop.jsx";

import ContactForm from "./component/contact_us/contact_us.jsx";

////! Admin Routes

import AdminSignup from "./admin-component/admin-Security/admin-sign-up/admin-sign-up.jsx";
import AdminSignInForm from "./admin-component/admin-Security/admin-login/admin-login.jsx";
import AdminHeader from "./admin-component/admin-internal/admin-header/admin-header.jsx";
import AddCategory from "./admin-component/admin-internal/admin-main/admin-category/add-category/add-category.jsx";
import SubCategory from "./admin-component/admin-internal/admin-main/admin-category/sub-category/sub-category.jsx";
import CreateProduct from "./admin-component/admin-internal/admin-main/admin-product/enter-product/enter-product.jsx";
import AdminProductsList from "./admin-component/admin-internal/admin-main/admin-product/all-product/all-product.jsx";
import AdminOrdersList from "./admin-component/admin-internal/admin-main/admin-orderList/admin-orderList.jsx";
import AdminDashboard from "./admin-component/admin-internal/admin-main/admin-Dashboard/adminDashboard.jsx";
import Addpurchase from "./admin-component/admin-internal/admin-main/admin-Dashboard/admin-addpuchase/addpurchase.jsx";
import ManagePurchase from "./admin-component/admin-internal/admin-main/admin-master/purchase/managePurchase/managePurchase.jsx";
import AddExpense from "./admin-component/admin-internal/admin-main/admin-master/expense/addExpense/addExpense.jsx";
import ManageExpense from "./admin-component/admin-internal/admin-main/admin-master/expense/manageExpense/manageExpense.jsx";
import AddPayementIn from "./admin-component/admin-internal/admin-main/admin-master/paymentIn/addPayementin/addPayementin.jsx";
import ManagePaymentIn from "./admin-component/admin-internal/admin-main/admin-master/paymentIn/managePaymentIn/managePaymentIn.jsx";
import AddPaymentOut from "./admin-component/admin-internal/admin-main/admin-master/paymentOut/addPaymentOut/addPaymentOut.jsx";
import ManagePaymentOut from "./admin-component/admin-internal/admin-main/admin-master/paymentOut/managePaymentOut/managePaymentOut.jsx";
import UploadExcelShade from "./admin-component/admin-internal/admin-main/uploadeExcelShade/uploadeExcelShade.jsx";
import CategoryUploadShade from "./admin-component/admin-internal/admin-main/categoryShadeUpload/categoryShadeUpload.jsx";
import NewInvoice from "./admin-component/admin-internal/admin-main/admin-master/invoice/newInvoice/newInvoice.jsx";
import ManageInvoice from "./admin-component/admin-internal/admin-main/admin-master/invoice/manageInvoice/manageInvoice.jsx";
import ContactAdmin from "./super Admin/contact/contactAdmin.jsx";
import AddStaff from "./admin-component/admin-internal/admin-main/admin-master/staff/addStaff/addStaff.jsx";
import ManageStaff from "./admin-component/admin-internal/admin-main/admin-master/staff/manageStaff/manageStaff.jsx";
import AdminRouteSingup from "./admin-component/admin-Security/adminPrivate/adminprivate.jsx";
import NotLoginPrivateAdmin from "./admin-component/admin-Security/adminPrivate/notLoginPrivate/notLoginPrivate.jsx";
import CouponGen from "./admin-component/admin-internal/admin-main/admin-coupon/admin-coupon.jsx";


// Super Admin
import NewClient from "./super Admin/addClient/newClient/newClient.jsx";
import ClientManage from "./super Admin/addClient/clientManage/clientManage.jsx";

import NewSupplier from "./super Admin/addSupplier/newSupplier/newSupplier.jsx";
import SupplierManage from "./super Admin/addSupplier/supplierManage/supplierManage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="*" element={<NotFound />}></Route>
      <Route path="/bilvani-refund-policy" element={<Refund />}></Route>
      <Route
        path="/bilvani-return-and-refund-policy"
        element={<Return_and_refund />}
      ></Route>
      <Route
        path="/bilvani-shipping-policy"
        element={<Shipping_policy />}
      ></Route>
      <Route
        path="/bilvani-terms-and-conditions"
        element={<Terms_and_conditions />}
      ></Route>
      <Route path="/bilvani-FAQs" element={<Faqs />}></Route>
      <Route path="/Supported-by" element={<Supported_by />}></Route>
      <Route path="/bilvani-contact" element={<ContactForm />}></Route>
      <Route path="/gift" element={<GiftBox />}></Route>
      <Route path="/" element={<App></App>}></Route>
      <Route path="/custom-colors" element={<MixedColor></MixedColor>}></Route>
      <Route
        path="/product/:category/:item/:id"
        element={<HomePageFullProduct></HomePageFullProduct>}
      ></Route>
      <Route path="/Bilvani-About-us" element={<AboutUs></AboutUs>}></Route>
      <Route path="/footer" element={<Footer />}></Route>
      <Route
        path="/mutliple-color-select-custom"
        element={<SelectedColor></SelectedColor>}
      ></Route>
      <Route
        path="/product-address-buy/:id"
        element={<SingleProductAddress></SingleProductAddress>}
      ></Route>
      <Route
        path="/save-custom-colors"
        element={<CustomSaveColor></CustomSaveColor>}
      ></Route>
      <Route path="/colororder" element={<CustomColorOrder />}></Route>
      <Route path="/shoplist" element={<ShopList />}></Route>
      {/* User Signin or Sigup than Display the User Save color  */}
      <Route element={<PrivateRoute></PrivateRoute>}>
        <Route
          path="/viewcart/exploreMode==true&refrence=Bilvani"
          element={<AddtoCard></AddtoCard>}
        ></Route>
        <Route
          path="/view-profile/exploreProfile-mode=true&refrence==Bilvani"
          element={<MyProfile />}
        ></Route>
        <Route
          path="/view-order/link==home_link&refrence==Bilvani"
          element={<MyOrder />}
        ></Route>
        <Route
          path="/view-order/exploreOrder==true&refrence==Bilvani/:orderId"
          element={<MyOrderInfo />}
        ></Route>
        <Route
          path="/view-custom-order/exploreOrder==true&refrence==Bilvani/:orderId"
          element={<OrderDetailsColor />}
        ></Route>
        <Route
          path="/select-category"
          element={<SelectedCategorytoColor />}
        ></Route>
      </Route>
      <Route element={<PrivateRouteSignup></PrivateRouteSignup>}>
        <Route path="/sign-up" element={<Signup />}></Route>
        <Route path="/sign-in" element={<Signin />}></Route>
      </Route>


      ////! Admin
      <Route element={<AdminRouteSingup />}>
        <Route path="/admin-bilvani" element={<AdminSignInForm />}></Route>
        <Route
          path="/admin-bilvani-create-signup"
          element={<AdminSignup></AdminSignup>}
        />
      </Route>


      <Route element={<NotLoginPrivateAdmin />}>
                    
                    
      <Route path="/admin-dashboard" element={<AdminDashboard />}></Route>
      <Route path="/admin-bilvani-header" element={<AdminHeader />}></Route>
      <Route
        path="/admin-bilvani-add-category"
        element={<AddCategory />}
      ></Route>
      <Route
        path="/admin-bilvani-sub-category"
        element={<SubCategory />}
      ></Route>
       <Route
        path="/admin/bilvani/coupon"
        element={<CouponGen />}
      ></Route>
      <Route
        path="/admin-bilvani-enter-product"
        element={<CreateProduct />}
      ></Route>
      <Route
        path="/admin-bilvani-all-product"
        element={<AdminProductsList />}
      ></Route>
      <Route path="/admin-bilvani-order" element={<AdminOrdersList />}></Route>
      <Route path="/admin-bilvani-purchase" element={<Addpurchase />}></Route>
      <Route
        path="/admin-bilvani-purchase-manage"
        element={<ManagePurchase />}
      ></Route>
      <Route path="/admin-bilvani-expense" element={<AddExpense />}></Route>
      <Route
        path="/admin-bilvani-expense-manage"
        element={<ManageExpense />}
      ></Route>
      <Route
        path="/admin-bilvani-paymentIn"
        element={<AddPayementIn />}
      ></Route>
      <Route
        path="/admin-bilvani-paymentIn-manage"
        element={<ManagePaymentIn />}
      ></Route>
      <Route
        path="/admin-bilvani-paymentOut"
        element={<AddPaymentOut />}
      ></Route>
      <Route
        path="/admin-bilvani-paymentOut-manage"
        element={<ManagePaymentOut />}
      ></Route>
      <Route
        path="/admin/bilvani/upload/shade"
        element={<UploadExcelShade />}
      ></Route>
      <Route
        path="/admin/bilvani/category/Shade"
        element={<CategoryUploadShade />}
      ></Route>
      <Route path="/admin/bilvani/new/invoice" element={<NewInvoice />}></Route>
      <Route
        path="/admin/bilvani/manage/invoice"
        element={<ManageInvoice />}
      ></Route>
      ////! Super Admin
      <Route path="/new-client" element={<NewClient />}></Route>
      <Route path="/manage-client" element={<ClientManage />}></Route>
      <Route path="/new-supplier" element={<NewSupplier />}></Route>
      <Route path="/manage-supplier" element={<SupplierManage />}></Route>
      <Route path="/admin/bilvani/contact" element={<ContactAdmin />}></Route>
      <Route path="/admin/bilvani/new/staff" element={<AddStaff />}></Route>
      <Route
        path="/admin/bilvani/manage/staff"
        element={<ManageStaff />}
      ></Route>
      

                </Route>


    </>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
