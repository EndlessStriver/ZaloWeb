import Login from "./page/Login"
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router"
import Home from "./page/Home"
import Chat from "./page/Chat"
import BookUser from "./page/BookUser"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/book-user" element={<BookUser />} />
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
