// A cláusula 'import' é utilizada sempre que uma classe precisar conhecer a estrutura
// de outra classe. No arquivo referenciado após o 'from' é necessário informar o que
// para a ser visível para a classe que utiliza o import. Para isso, lá colocamos a 
// indicação 'export'

import { getDatabase, ref, query, orderByChild, equalTo, get, set, remove } from "firebase-database.js"

import User from "/model/User.js"
import UserDTO from "/model/UserDTO.js"
import ModelError from "/model/ModelError.js"

/*
 * DAO --> Data Access Object
 * A responsabilidade de um DAO é fazer uma ponte entre o programa e o 
 * recurso de persistência dos dados (ex. SGDB)
 */

export default class UserDAO {

    static promessaConexao = null

    constructor() {
        this.obterConexao()
    }

    /*
     *  Devolve uma Promise com a referência para o BD. Sempre que 'obterConexao' for chamado, 
     *  será necessário usar o await para recuperar o IDBDatabase.
     */
    async obterConexao() {
        if (UserDAO.promessaConexao == null) {
            UserDAO.promessaConexao = new Promise(function (resolve, reject) {
                const db = getDatabase()
                if (db)
                    resolve(db)
                else
                    reject(new ModelError("Não foi possível estabelecer conexão com o BD"))
            })
        }
        return UserDAO.promessaConexao
    }

    //-----------------------------------------------------------------------------------------//
    // Exemplo de consulta baseada na chave de indexação dos objetos de uma determinada entrada
    // No caso de Usuário, os objetos estão indexados pelo UID
    //-----------------------------------------------------------------------------------------//

    async obterUsuarioPeloUID(uid) {
        let connectionDB = await this.obterConexao()
        return new Promise((resolve) => {
            // Monto uma referência para o objeto que desejo recuperar
            let dbRefUsuario = ref(connectionDB, 'usuarios/' + uid)
            // Monto a consulta a partir da referência
            let consulta = query(dbRefUsuario)
            // Executo a consulta. Ela devolve uma Promise
            let resultPromise = get(consulta)
            resultPromise.then(dataSnapshot => {
                // Se a consulta teve um resultado, então pegamos o conteúdo (val()) do objeto
                let usr = dataSnapshot.val()
                if (usr != null)
                    // Crio um objeto User a partir do objeto JSON retornado por val().
                    resolve(new User(usr.email, usr.uid, usr.funcao))
                else
                    // Retorno nul se o val() também for nulo.
                    resolve(null)
            })
        })
    }

    //-----------------------------------------------------------------------------------------//
    // Exemplo de consulta baseada em algum atributo do objeto que desejamos recuperar. Neste
    // caso, quero recuperar o objeto User baseado em seu email. Neste caso, será mandatório
    // colocar no arquivo de regras, o '.indexOn' do campo para a pesquisa.
    //-----------------------------------------------------------------------------------------//

    async obterUsuarioPeloEmail(email) {
        let connectionDB = await this.obterConexao()
        return new Promise((resolve) => {
            let dbRefUsuario = ref(connectionDB, 'usuarios')
            // Como a consulta vai buscar um objeto por um atributo que não é a chave de indexação
            // devemos indicar o 'orderByChild' e o 'equalTo'
            let paramConsulta = orderByChild('email')
            let paramEqual = equalTo(email)
            // Criamos a consulta
            let consulta = query(dbRefUsuario, paramConsulta, paramEqual)
            // Executamos a consulta
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

    //-----------------------------------------------------------------------------------------//
    // Exemplo de consulta que retorna todos os objetos da entrada 'usuarios'
    //-----------------------------------------------------------------------------------------//
    async obterUsuarios() {
        let connectionDB = await this.obterConexao()

        return new Promise((resolve) => {
            let conjUsuarios = []
            let dbRefUsuarios = ref(connectionDB, 'usuarios')
            let paramConsulta = orderByChild('email')
            let consulta = query(dbRefUsuarios, paramConsulta)
            let resultPromise = get(consulta)
            resultPromise.then(dataSnapshot => {
                // Neste caso, a consulta irá retornar mais de um objeto. Por isto, chamamos o forEach
                dataSnapshot.forEach(dataSnapshotObj => {
                    let chave = dataSnapshotObj.key // não precisa! Só para mostrar 
                    // Recupero o objeto
                    let elem = dataSnapshotObj.val()
                    // Instancio o objeto usuário e o acrescento no array conjUsuarios
                    conjUsuarios.push(new User(elem.email, elem.uid, elem.funcao))
                })
                // Quando terminar o forEach, o resultado da promise será o array
                resolve(conjUsuarios)
            }, (e) => console.log("#" + e))
        })
    }

    async incluir(usuario) {
        let connectionDB = await this.obterConexao()
        
        let resultado = new Promise((resolve, reject) => {
            // Monto a referência para o Firebase baseado no objeto recebido por parâmetro. Esse
            // possui internamente o 'uid' que é acessado pelo método 'getUid'
            let dbRefUsuario = ref(connectionDB, 'usuarios/' + usuario.getUid())
            // No momento da inclusão, os atributos não podem ser privados. Assim, 
            // convertemos o objeto User em um UserDTO
            let setPromise = set(dbRefUsuario, new UserDTO(usuario))
            setPromise.then(value => { resolve(true) }, erro => { reject(erro) })
        })
        
        return resultado
    }

    async alterar(usuario) {
        let connectionDB = await this.obterConexao()
        
        let resultado = new Promise((resolve, reject) => {
            let dbRefUsuario = ref(connectionDB, 'usuarios/' + usuario.getUid())
            // No momento da alteração, os atributos não podem ser privados. Assim, 
            // convertemos o objeto User em um UserDTO
            let setPromise = set(dbRefUsuario, new UserDTO(usuario))
            setPromise.then(value => { resolve(true) }, erro => { reject(erro) })
        })
        
        return resultado
    }

    async excluir(usuario) {
        let connectionDB = await this.obterConexao()
        
        let resultado = new Promise((resolve, reject) => {
            let dbRefUsuario = ref(connectionDB, 'usuarios/' + usuario.getUid())
            // No momento da inclusão, os atributos não podem ser privados. Assim, 
            // convertemos o objeto User em um UserDTO
            let setPromise = remove(dbRefUsuario)
            setPromise.then(value => { resolve(true) }, erro => { reject(erro) })
        })
        
        return resultado
    }
}