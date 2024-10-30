// auth.js
import { auth } from './firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'
import { getDatabase, ref, query, get, set } from 'firebase/database'
import { Navigate, redirect } from 'react-router-dom'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getGoogleProvider = () => new GoogleAuthProvider()

const db = getDatabase()

let userLoggedIn = false

export const Login = async (email, senha) => {
    if (!emailRegex.test(email)) {
        return {errors: {email: "Email inválido"}};
    }

    if (senha.length < 8) {
        return {errors: {senha: "Senha deve ter no mínimo 8 caracteres"}};
    }

    try {
        const credencial = await signInWithEmailAndPassword(auth, email, senha);
        const user = credencial.user;

        if (!user.emailVerified) {
            return {errors: {login: "Email não verificado. Verifique sua caixa de entrada."}};
        }

        const dbRefUsuario = ref(db, `usuarios/${user.uid}`);
        const dataSnapshot = await get(query(dbRefUsuario));
        const usuario = dataSnapshot.val();

        if (dataSnapshot.exists() && usuario.funcao === 'USER') {
            userLoggedIn = true;
            return {success: {login: "Login efetuado com sucesso!"}};
        } else {
            return {errors: {login: "Usuário não registrado. Crie uma conta e tente novamente."}};
        }
    } catch (erro) {
        console.error("Erro no login:", erro); // Adicione este log
        return {errors: {login: `Erro ao fazer login\n${erro.message}`}};
    }
};

export const LoginWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, getGoogleProvider())
        const user = result.user

        const snapshot = await get(ref(db, `usuarios/${user.uid}`))
        if (snapshot.exists()) {
            userLoggedIn = true
            return {success: {loginWithGoogle: "Login com Google efetuado com sucesso."}}
        } else {
            return {errors: {loginWithGoogle: "Usuário não registrado. Crie uma conta e tente novamente."}}
        }
    } catch (erro) {
        console.error(erro)
        return {errors: {loginWithGoogle: `Erro ao fazer login com Google\n${erro.message}`}}
    }
}

export const Signin = async (nome, email, senha) => {
    if (!nome) {
        return {errors: {nome: "Nome é obrigatório"}}
    }

    if (!emailRegex.test(email)) {
        return {errors: {email: "Email inválido"}}
    }

    if (senha.length < 8) {
        return {errors: {senha: "Senha deve ter no mínimo 8 caracteres"}}
    }

    try {
        const credencial = await createUserWithEmailAndPassword(auth, email, senha)
        const user = credencial.user

        await sendEmailVerification(user)

        const dbRefUsuario = ref(db, `usuarios/${user.uid}`)
        const objUsuario = {
            uid: user.uid,
            nome: nome,
            email: user.email,
            funcao: 'USER',
        }

        await set(dbRefUsuario, objUsuario)

        console.log("Conta criada com sucesso. Email de verificação enviado")
        return {success: {signin: "Conta criada com sucesso. Email de verificação enviado."}}
    } catch (erro) {
        console.error(erro)
        return {errors: {signin: `Erro ao criar conta\n${erro.message}`}}
    }
}

export const SignInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, getGoogleProvider())
        const user = result.user

        const snapshot = await get(ref(db, `usuarios/${user.uid}`))

        if (!snapshot.exists()) {
            await set(ref(db, `usuarios/${user.uid}`), {
                uid: user.uid,
                nome: user.displayName,
                email: user.email,
                funcao: 'USER',
            })

            console.log("Conta criada com Google com sucesso.")
            return {success: {sigin: "Conta criada com Google com sucesso."}}
        }
    } catch (erro) {
        console.error(erro)
        return {errors: {signinWithGoogle: `Erro ao criar conta com Google\n${erro.message}`}}
    }
}

const LogOut = async () => {
    try {
        await auth.signOut()
        localStorage.setItem('userLoggedIn', false)
        localStorage.removeItem('userUID')
        return redirect('/')
    } catch (err) {
        console.error(err)
    }
}

export const isLoggedIn = () => {
    return userLoggedIn
}

export default LogOut