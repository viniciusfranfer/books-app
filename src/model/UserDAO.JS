import { getDatabase, ref, query, orderByChild, equalTo, get, set, remove } from "firebase-database.js"
import User from "/model/User.js"
import UserDTO from "/model/UserDTO.js"
import ModelError from "/model/ModelError.js"

export default class UserDAO {

    static promessaConexao = null

    constructor() {
        this.obterConexao()
    }

    async obterConexao() {
        if (UserDAO.promessaConexao == null) {
            UserDAO.promessaConexao = new Promise((resolve, reject) => {
                const db = getDatabase();
                if (db) {
                    resolve(db);
                } else {
                    reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
                }
            });
        }
        return UserDAO.promessaConexao;
    }

    async obterDadosUsuario(uid) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            let dbRefUsuario = ref(connectionDB, 'usuarios/' + uid);
            get(dbRefUsuario)
                .then(dataSnapshot => {
                    let usr = dataSnapshot.val();
                    if (usr) resolve(usr);
                    else resolve(null);
                })
                .catch(error => reject(error));
        });
    }

    async obterUsuarioPeloUID(uid) {
        let connectionDB = await this.obterConexao()
        return new Promise((resolve) => {
            let dbRefUsuario = ref(connectionDB, 'usuarios/' + uid)
            let consulta = query(dbRefUsuario)
            let resultPromise = get(consulta)
            resultPromise.then(dataSnapshot => {
                let usr = dataSnapshot.val()
                if (usr != null)
                    resolve(new User(usr.email, usr.uid, usr.funcao))
                else
                    resolve(null)
            })
        })
    }

    async obterUsuarioPeloEmail(email) {
        let connectionDB = await this.obterConexao()
        return new Promise((resolve) => {
            let dbRefUsuario = ref(connectionDB, 'usuarios')
            let paramConsulta = orderByChild('email')
            let paramEqual = equalTo(email)
            let consulta = query(dbRefUsuario, paramConsulta, paramEqual)
            let resultPromise = get(consulta)
            resultPromise.then(dataSnapshot => {
                let usr = dataSnapshot.val()
                if (usr != null)
                    resolve(new User(usr.email, usr.uid, usr.funcao))
                else
                    resolve(null)
            })
        })
    }

    async obterUsuarios() {
        let connectionDB = await this.obterConexao()

        return new Promise((resolve) => {
            let conjUsuarios = []
            let dbRefUsuarios = ref(connectionDB, 'usuarios')
            let paramConsulta = orderByChild('email')
            let consulta = query(dbRefUsuarios, paramConsulta)
            let resultPromise = get(consulta)
            resultPromise.then(dataSnapshot => {

                dataSnapshot.forEach(dataSnapshotObj => {
                    let chave = dataSnapshotObj.key 
                    let elem = dataSnapshotObj.val()
                    conjUsuarios.push(new User(elem.email, elem.uid, elem.funcao))
                })
                resolve(conjUsuarios)
            }, (e) => console.log("#" + e))
        })
    }

    async incluir(usuario) {
        let connectionDB = await this.obterConexao()
        
        let resultado = new Promise((resolve, reject) => {
            let dbRefUsuario = ref(connectionDB, 'usuarios/' + usuario.getUid())
            let setPromise = set(dbRefUsuario, new UserDTO(usuario))
            setPromise.then(value => { resolve(true) }, erro => { reject(erro) })
        })
        
        return resultado
    }

    async alterar(usuario) {
        let connectionDB = await this.obterConexao()
        
        let resultado = new Promise((resolve, reject) => {
            let dbRefUsuario = ref(connectionDB, 'usuarios/' + usuario.getUid())
            let setPromise = set(dbRefUsuario, new UserDTO(usuario))
            setPromise.then(value => { resolve(true) }, erro => { reject(erro) })
        })
        
        return resultado
    }

    async alterarNomeEmail(uid, nome, email) {
        const connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            const dbRefUsuario = ref(connectionDB, 'usuarios/' + uid);
            const updateData = { nome, email };
            set(dbRefUsuario, updateData)
                .then(() => resolve(true))
                .catch((erro) => reject(erro));
        });
    }

    async excluir(usuario) {
        let connectionDB = await this.obterConexao()
        
        let resultado = new Promise((resolve, reject) => {
            let dbRefUsuario = ref(connectionDB, 'usuarios/' + usuario.getUid())
            let setPromise = remove(dbRefUsuario)
            setPromise.then(value => { resolve(true) }, erro => { reject(erro) })
        })
        
        return resultado
    }

}