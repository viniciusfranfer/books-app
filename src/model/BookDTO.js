export default class BookDTO {
    constructor(book) {
        this.id = book.id;
        this.titulo = book.titulo;
        this.autor = book.autor;
        this.genero = book.genero;
        this.status = book.status;
        this.nota = book.nota;
        this.review = book.review;
        this.imagem = book.imagem;
    }

    getId() {
        return this.id;
    }

    getTitulo() {
        return this.titulo;
    }

    getAutor() {
        return this.autor;
    }

    getGenero() {
        return this.genero;
    }

    getStatus() {
        return this.status;
    }

    getNota() {
        return this.nota;
    }

    getReview() {
        return this.review;
    }

    toString() {
        let texto = `ID: ${this.id}\n`;
        texto += `Título: ${this.titulo}\n`;
        texto += `Autor: ${this.autor}\n`;
        texto += `Gênero: ${this.genero}\n`;
        texto += `Status: ${this.status}\n`;
        texto += `Nota: ${this.nota}\n`;
        texto += `Review: ${this.review}\n`;

        return texto;
    }
}
