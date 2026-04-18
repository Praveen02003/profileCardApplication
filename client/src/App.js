import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Login } from './login/Login';
import { Signup } from './signup/Signup';
import { Dashboard } from './dashboard/Dashboard';
import { Add } from './add/Add';
// import { Edit } from './edit/Edit';

function App() {
  return (
    // routes
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/addUser' element={<Add/>}/>
        {/* <Route path='/editUser/:id' element={<Edit/>}/> */}
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
