import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import LoginPage from "./page/LoginPage"
import HomePage from './page/HomePage'
import ChatPage from './page/ChatPage'
import BookUserPage from './page/BookUserPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />}>
          <Route index element={<Navigate to="/chat" replace />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/book-user-group" element={<BookUserPage />} />
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
