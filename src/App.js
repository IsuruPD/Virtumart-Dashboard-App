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
import ProtectedRoute from './components/authentication/ProtectedRoute';
import ReportGenerationModule from './pages/accounts/reports/ReportGenerationModule';
import UserProfile from './pages/userProfile/UserProfile'
import DashboardSettings from './pages/settings/DashboardSettings'; 


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route path="" element={<Login/>}/>
              <Route path="dashboard" index element={<ProtectedRoute><Home/></ProtectedRoute>}/>

              <Route 
                path="users/*" 
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <Routes>
                      <Route path="" element={<CustomerDetails />} />
                      <Route path="manage/:userId" element={<CustomerManagement />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="staff/*" 
                element={
                  <ProtectedRoute requiredRoles={['admin']}>
                    <Routes>
                      <Route path="" element={<StaffDetails />} />
                      <Route path="manage/:isNew/:employeeId" element={<StaffManagement />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="products/*" 
                element={
                  <ProtectedRoute requiredRoles={['inventory manager', 'admin']}>
                    <Routes>
                      <Route path="" element={<ProductDetails />} />
                      <Route path="manage" element={<ProductDisplay />} />
                      <Route path="manage/:isNew/:productId" element={<ProductManagement />} />
                      <Route path="manage/categories" element={<ProductCategories />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="orders/*" 
                element={
                  <ProtectedRoute requiredRoles={['accountant', 'admin']}>
                    <Routes>
                      <Route path="" element={<OrderManagement />} />
                      <Route path="all" element={<AllOrders />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="support/*" 
                element={
                  <ProtectedRoute requiredRoles={['customer support', 'admin']}>
                    <CustomerSupport />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="accounts/*" 
                element={
                  <ProtectedRoute requiredRoles={['accountant', 'admin']}>
                    <Routes>
                      <Route path="" element={<AccountsManagement />} />
                      <Route path="reports/" element={<ReportGenerationModule />} />
                      {/* <Route path="account" element={<SingleItem />} /> */}
                      <Route path="new" element={<NewItem inputs={productInputs} title="Add New Accounts" />} />
                    </Routes>
                  </ProtectedRoute>
                } 
              />

              <Route 
                  path="settings/*" 
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'inventory manager', 'customer support', 'accountant']}>
                      <DashboardSettings />
                    </ProtectedRoute>
                  } 
                />

              <Route 
                path="profile/*" 
                element={
                  <ProtectedRoute requiredRoles={['admin', 'inventory manager', 'customer support', 'accountant']}>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
