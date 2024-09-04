import './App.css';
import Products from './pages/addProducts';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import NewItem from './pages/new/NewItem';
import SingleItem from './pages/singleItem/SingleItem';
import{ BrowserRouter, Routes, Route} from "react-router-dom";
import { userInputs, productInputs } from './formSource';
import ProductDetails from './pages/products/productDetails';
import ProductDisplay from './pages/products/productDisplay/ProductDisplay';
import ProductManagement from './pages/products/productManagement/ProductManagement';
import ProductCategories from './pages/products/productCategories/ProductCategories';
import CustomerDetails from './pages/customers/CustomerDetails';
import StaffDetails from './pages/staff/StaffDetails';
import StaffManagement from './pages/staff/staffManagement/StaffManagement';
import AccountsManagement from './pages/accounts/AccountsManagement';
import OrderManagement from './pages/orders/OrderManagement';
import AllOrders from './pages/orders/AllOrders';
import CustomerSupport from './pages/support/CustomerSupport';
import CustomerManagement from './pages/customers/customerManagement/CustomerManagement';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route path="" element={<Login/>}/>
              <Route path="dashboard" index element={<Home/>}/>

              <Route path="users">
                <Route index element={<CustomerDetails/>}/>
                {/* <Route path=":userId" element={<SingleItem/>}/> */}
                <Route path="manage/:userId/" element={<CustomerManagement/>}/>
              </Route>
              
              <Route path="staff">
                <Route index element={<StaffDetails/>}/>
                {/* <Route path=":staffId" element={<SingleItem/>}/> */}
                <Route path="manage/:isNew/:employeeId/" element={<StaffManagement/>}/>
              </Route>

              <Route path="products">
                <Route index element={<ProductDetails/>}/>
                <Route path="manage/" element={<ProductDisplay/>}/>
                <Route path="manage/:isNew/:productId/" element={<ProductManagement/>}/>
                <Route path="manage/categories" element={<ProductCategories />} />
              </Route>

              <Route path="orders">
                <Route index element={<OrderManagement/>}/>
                <Route path="all/" element={<AllOrders />} />
              </Route>

              <Route path="support">
                <Route index element={<CustomerSupport/>}/>
              </Route>

              <Route path="accounts">
                <Route index element={<AccountsManagement/>}/>
                <Route path="account" element={<SingleItem/>}/>
                <Route path="new" element={<NewItem inputs={productInputs} title="Add New Accounts"/>}/>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
