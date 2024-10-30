import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Login, LoginWithGoogle } from '../utils/auth/auth.js'
import bookAppLogoRbg from '../assets/logo/Book-app-inverted-resized.png'
import google_icon from '../assets/icons/google-icon.svg'
import eye_icon from '../assets/icons/eye-icon.svg'
import eye_slash_icon from '../assets/icons/eye-slash-icon.svg'
import './styles/Login-signIn.css'
import { ToastContainer, toast, Slide } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const LogIn = () => {
    const navigate = useNavigate()

    const [values, setValues] = useState({
        email: '',
        senha: ''
    })

    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [notifications, setNotifications] = useState({})
    const [errors, setErrors] = useState({})
    const [showPassword, setShowPassword] = useState(false)

    const handleSenha = () => {
        setShowPassword(!showPassword)                     
    }

    const handleInput = (e) => {
        setValues(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        // console.log("Valores antes do login:", values); // Debugging
        if (!values.email || !values.senha) {
            setNotifications({
                errors: {
                    email: !values.email ? 'Email é obrigatório' : '',
                    senha: !values.senha ? 'Senha é obrigatória' : '' 
                }
            })

            return
        }
        
        const result = await Login(values.email, values.senha)
        setNotifications(result)
    }

    const LogInWithGoogle = async (e) => {
        e.preventDefault()

        if (!isLoggingIn) {
            setIsLoggingIn(true)
            const result = await LoginWithGoogle()
            setNotifications(result)
        }
    }

    useEffect(() => {
        if (notifications.errors) {
            const errorMessages = []
    
            if (notifications.errors.email) errorMessages.push(notifications.errors.email)
            if (notifications.errors.senha) errorMessages.push(notifications.errors.senha)
            if (notifications.errors.login) errorMessages.push(notifications.errors.login)
            if (notifications.errors.loginWithGoogle) errorMessages.push(notifications.errors.loginWithGoogle)
    
            if (errorMessages.length > 0) {
                notify(`Erro ao efetuar login!\n${errorMessages.join('\n')}`, 'error')
            }
        } else if (notifications.success) {
            notify('Login efetuado com sucesso!', 'success')
            setIsLoggingIn(false)
            setTimeout(() => {
                navigate('/home')
            }, 1000)
        }
    }, [notifications, navigate])    

    const notify = (message, type) => {
        toast[type](<div className="toast-content"><span className="toast-icon">⚠️</span>{message}</div>, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: false,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Slide
        });
    }

    return (
        <div>
            <div className = "auth-panel" data-aos = "fade-up">
                {/* <BackBtn link = {'/'}/> */}
                <div className = "img-cont">
                    <img className = "login-logo" src = {bookAppLogoRbg} alt = "Logo"></img>
                </div>
                <form className = "form" onSubmit = {onSubmit}>
                    <div className = "input-label-cont">
                        <input
                            autoFocus
                            type = "email"
                            name = "email"
                            placeholder = "Insira aqui seu e-mail"
                            onChange = {handleInput}
                        />
                    </div>
                    {errors.email && <span className = "errors">{errors.email}</span>}
                    <div className = "input-label-cont">
                        <div className = "input-cont">
                        <input
                                type = {showPassword ? "text" : "password"}
                                name = "senha"
                                placeholder = "Insira aqui sua senha"
                                onChange = {handleInput}
                            />
                            <div className = "eye-cont">
                                <img 
                                    src = {showPassword ? eye_icon : eye_slash_icon}
                                    alt = ""
                                    className = "icons eye-icon"
                                    onClick = {() => handleSenha()}
                                ></img>
                            </div>
                        </div>
                    </div>
                    <div className = "btn-cont-auth">
                        <button className = "btns azul-claro" id = "btnLogin" type = "submit">LOGIN</button>
                    </div>

                    <div className = "separador">
                        <span>OR</span>
                    </div>
                    
                    <div className = "btn-cont-auth">
                    <button className = "btns btn-alternative" id = "btnGoogle" onClick = {LogInWithGoogle}>
                        <>
                            <img className = "icons google-icon" src = {google_icon} alt = ""></img>
                            GOOGLE
                        </>
                    </button>
                        <Link className = "btns signIn" to = "/signin">CREATE ACCOUNT</Link>
                    </div>
                </form>
                <ToastContainer
                    position="top-center" // Mantém a posição no topo
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick={false}
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                    theme="dark"
                    transition={Slide}
                    className="custom-toast-container"
                    toastClassName="custom-toast"
                    bodyClassName="custom-toast-body"
                />

            </div>
        </div>
    )
}

export default LogIn