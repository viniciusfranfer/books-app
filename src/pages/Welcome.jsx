import './styles/Welcome.css'
import { useAuth } from '../utils/context/authContext/index'
import { Link, Navigate } from 'react-router-dom'
import bookAppLogoRbg from '../assets/logo/Book-app-inverted.png'

const Welcome = () => {
    const { userLoggedIn } = useAuth()
    
    return (
        <div className='welcome'>
            {userLoggedIn && (<Navigate to = "/home" replace = {true}/>)}
            <div className = "welcome-panel" data-aos = "fade-up">
                <div className = "img-cont">
                    <img className = "welcome-logo" src = {bookAppLogoRbg} alt = "Logo"></img>
                </div>
                <div className = "btn-cont">
                    <Link className = "btnsWelcome" id = "btnLogin" to = "/login">LOGIN</Link>
                    <Link className = "btnsWelcome" id = "btnCriarConta" to = "/signin">CREATE ACCOUNT</Link>
                </div>
            </div>
        </div>
    )
}

export default Welcome