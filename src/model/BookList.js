import Book from './Book.js';

class BookList {
    #idLista;
    #nome;
    #livros;

    constructor(idLista, nome, livros = []) {
        if (!idLista) throw new Error('ID da lista inválido');
        this.#idLista = idLista;
        this.setNome(nome);
        this.#livros = livros;
    }

    // Getters
    getIdLista() {
        return this.#idLista;
    }

    getNome() {
        return this.#nome;
    }

    getLivros() {
        return this.#livros;
    }

    // Setters com validação
    setNome(nome) {
        if (!BookList.validarNome(nome)) {
            throw new Error('Nome inválido: ' + nome);
        }
        this.#nome = nome;
    }

    // Métodos de manipulação de livros
    adicionarLivro(livro) {
        if (livro instanceof Book) {
            this.#livros.push(livro);
        } else {
            throw new Error("Objeto não é uma instância de Book");
        }
    }

    removerLivro(idLivro) {
        this.#livros = this.#livros.filter(livro => livro.getId() !== idLivro);
    }

    // Método de validação
    static validarNome(nome) {
        return nome && nome.length >= 1 && nome.length <= 100;
    }
}

export default BookList;
