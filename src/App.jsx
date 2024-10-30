import AuthProvider  from 'C:/vscode/books-app/src/utils/context/authContext/index.jsx'
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import { useEffect } from 'react'
import Welcome from "./pages/Welcome.jsx"
import Login from "./pages/login.jsx"
import SignIn from './pages/SignIn.jsx';
import Page from './pages/Page.jsx';
import Profile from "./pages/Profile.jsx";
import Books from './pages/Books.jsx';
import Book from './pages/Book.jsx';
import AddBook from './pages/AddBook.jsx';
import BookList from './pages/BookList.jsx';
import './App.css'

const App = () => {
    // useEffect(() => {
    //     window.scrollTo(0, 0)
    // }, [])

    return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />}/>
            <Route path="/signin" element={<SignIn />}/>
            <Route path="/home" element={<Page />}/>
            <Route path="/profile" element={<Profile />} />
            <Route path="/books" element={<Books />} />
            <Route path="/book/:id" element={<Book />} />
            <Route path="/addbook" element={<AddBook />} />
            <Route path="/booklist" element={<BookList />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>

    // <div className = "App">
    //     <h1>App</h1>
    //     <AppRoutes />
    //     <h1>jOEGE</h1>
    // </div>
)
}

export default App