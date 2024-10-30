class BookList {
    #idLista; 
    #livros;  
    #nome;    

    constructor(idLista, nome, livros = []) {
        if (!idLista) throw new Error('ID da lista inválido');
        this.#idLista = idLista;
        this.setNome(nome);
        this.#livros = livros;
    }

    getIdLista() {
        return this.#idLista;
    }

    getNome() {
        return this.#nome;
    }

    getLivros() {
        return this.#livros;
    }
    setNome(nome) {
        if (!BookList.validarNome(nome)) {
            throw new Error('Nome inválido: ' + nome);
        }
        this.#nome = nome;
    }

    setLivros(livros) {
        this.#livros = livros;
    }

    static validarNome(nome) {
        return nome && nome.length >= 1 && nome.length <= 100;
    }

    // adicionarLivro(livro) {
    //     this.#livros.push(livro);
    // }

    // removerLivro(livroId) {
    //     this.#livros = this.#livros.filter(livro => livro.getId() !== livroId);
    // }
}

export default BookList;
