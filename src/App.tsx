import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from "react-router"
import HomePage from './page/HomePage'
import ChatPage from './page/ChatPage'
import BookUserPage from './page/BookUserPage'
import ListFriend from './component/ListFriend'
import ListGroup from './component/ListGroup'
import ListFriendInvitation from './component/ListFriendInvitation'
import ListInvitationCommunityGroup from './component/ListInvitationCommunityGroup'
import LoginRegisterPage from './page/LoginRegisterPage'
import FormLogin from './component/FormLogin'
import FormRegister from './component/FormRegister'
import FormVerify from './component/FormVerify'
import FormUpdateProfile from './component/FormUpdateProfile'
import FormForgotPassword from './component/FormForgotPassword'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<LoginRegisterPage />} >
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<FormLogin />} />
          <Route path="register" element={<FormRegister />} />
          <Route path="verify" element={<FormVerify />} />
          <Route path="profile-update" element={<FormUpdateProfile />} />
          <Route path="forgot-password" element={<FormForgotPassword />} />
        </Route>
        <Route path="/" element={<HomePage />}>
          <Route index element={<Navigate to="chat" replace />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="book-user-group" element={<BookUserPage />}>
            <Route index element={<Navigate to="friends" replace />} />
            <Route path="friends" element={<ListFriend />} />
            <Route path="groups" element={<ListGroup />} />
            <Route path="friend-invitation" element={<ListFriendInvitation />} />
            <Route path="invitation-community-group" element={<ListInvitationCommunityGroup />} />
          </Route>
        </Route>
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
