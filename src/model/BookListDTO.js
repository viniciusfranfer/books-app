export default class BookListDTO {
    constructor(bookList) {
        this.idLista = bookList.getIdLista(); // Acessando ID da lista
        this.nome = bookList.getNome(); // Acessando nome da lista
        this.livros = bookList.getLivros().map(livro => livro.getId()); // Armazenando apenas os IDs dos livros
    }

    getIdLista() {
        return this.idLista;
    }

    getNome() {
        return this.nome;
    }

    getLivros() {
        return this.livros;
    }

    toString() {
        let texto = `ID da Lista: ${this.idLista}\n`;
        texto += `Nome: ${this.nome}\n`;
        texto += `Livros: ${this.livros.join(', ')}\n`;
        return texto;
    }
}
