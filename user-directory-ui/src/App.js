import logo from './logo.svg';

import { BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import UserList from './pages/UserList';  
import AddUser from './pages/AddUser';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to="/users" />}/>
        <Route path='/users' element={<UserList/>}/>
        <Route path='/add-user' element={<AddUser/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
