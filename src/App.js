import './App.css';
import Products from './pages/addProducts';
import Home from "./pages/home/Home";
import List from "./pages/list/List";
import Login from "./pages/login/Login";
import NewItem from './pages/new/NewItem';
import SingleItem from './pages/singleItem/SingleItem';
import{ BrowserRouter, Routes, Route} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Products/> */}
        {/* <Home/> */}
        {/* <List/> */}
        {/* <Login/> */}
        {/* <NewItem/> */}
        {/* <SingleItem/> */}

        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home/>}/>
              <Route path="login" element={<Login/>}/>

              <Route path="users">
                <Route index element={<List/>}/>
                <Route path=":userId" element={<SingleItem/>}/>
                <Route path="new" element={<NewItem/>}/>
              </Route>

              <Route path="products">
                <Route index element={<List/>}/>
                <Route path=":productId" element={<SingleItem/>}/>
                <Route path="new" element={<NewItem/>}/>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}

export default App;
