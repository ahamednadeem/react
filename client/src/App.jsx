import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Users from './Users'
import Login from './Login'
import UpdateUsers from './UpdateUsers'
import CreateUsers from './CreateUsers'
import UserSearch from './UserSearch'; 
import Signup from './Signup'
import Nav from './Nav'
import Home from './Home'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

function App() 
{
  return (
    <BrowserRouter>
    
    <Routes>
      <Route path='/users' element={<Users/>}></Route>
      <Route path='/create' element={<CreateUsers/>}></Route>
      <Route path='/update/:id' element={<UpdateUsers/>}></Route>
      <Route path='/search' element={<UserSearch/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>
      <Route path='/' element={<Home/>}></Route>

    </Routes>
    </BrowserRouter>
  )
}

export default App