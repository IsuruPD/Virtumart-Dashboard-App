import './App.css';
import Products from './pages/addProducts';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import NewItem from './pages/new/NewItem';
import SingleItem from './pages/singleItem/SingleItem';
import{ BrowserRouter, Routes, Route} from "react-router-dom";
import { userInputs, productInputs } from './formSource';
import ProductManagement from './pages/products/ProductManagement';
import CustomerManagement from './pages/customers/CustomerManagement';
import StaffManagement from './pages/staff/StaffManagement';
import AccountsManagement from './pages/accounts/AccountsManagement';
import OrderManagement from './pages/orders/OrderManagement';
import CustomerSupport from './pages/support/CustomerSupport';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home/>}/>
              <Route path="login" element={<Login/>}/>

              <Route path="users">
                <Route index element={<CustomerManagement/>}/>
                <Route path=":userId" element={<SingleItem/>}/>
                {/* <Route path="new" element={<NewItem inputs={userInputs} title="Add New User"/>}/> */}
              </Route>
              
              <Route path="staff">
                <Route index element={<StaffManagement/>}/>
                <Route path=":productId" element={<SingleItem/>}/>
                <Route path="new" element={<NewItem inputs={productInputs} title="Add New Employee"/>}/>
              </Route>

              <Route path="products">
                <Route index element={<ProductManagement/>}/>
                <Route path=":productId" element={<SingleItem/>}/>
                <Route path="new" element={<NewItem inputs={productInputs} title="Add New Product"/>}/>
              </Route>

              <Route path="orders">
                <Route index element={<OrderManagement/>}/>
                <Route path=":productId" element={<SingleItem/>}/>
                <Route path="new" element={<NewItem inputs={productInputs} title="Add New Order"/>}/>
              </Route>

              <Route path="support">
                <Route index element={<CustomerSupport/>}/>
                <Route path=":productId" element={<SingleItem/>}/>
                <Route path="new" element={<NewItem inputs={productInputs} title="Add New Support"/>}/>
              </Route>

              <Route path="accounts">
                <Route index element={<AccountsManagement/>}/>
                <Route path=":productId" element={<SingleItem/>}/>
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
