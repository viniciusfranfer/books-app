export default class UsuarioDTO {

    constructor(usr) {
        this.email = usr.getEmail()
        this.uid = usr.getUid()
        this.funcao = usr.getFuncao()
    }

    getEmail() {
        return this.email
    }

    getUid() {
        return this.uid
    }

    getFuncao() {
        return this.funcao
    }

    toString() {
        let texto = "Email: " + this.email + "\n"
        texto += "UID: " + this.uid + "\n"
        texto += "Função: " + this.funcao + "\n"

        return texto
    }
}