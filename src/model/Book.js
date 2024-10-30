class Book {
    #id;
    #titulo;
    #autor;
    #genero;
    #status;
    #nota;
    #review;
    #imagem;
    
    constructor(id, titulo, autor, genero, status, nota, review, imagem) {
        if (!id) throw new Error('ID inválido');
        this.#id = id;
        
        this.setTitulo(titulo);
        this.setAutor(autor);
        this.setGenero(genero);
        this.setStatus(status);
        this.setNota(nota);
        this.setReview(review);
        this.setImagem(imagem);
    }

    // Getters
    getId() {
        return this.#id;
    }

    getTitulo() {
        return this.#titulo;
    }

    getAutor() {
        return this.#autor;
    }

    getGenero() {
        return this.#genero;
    }

    getStatus() {
        return this.#status;
    }

    getNota() {
        return this.#nota;
    }

    getReview() {
        return this.#review;
    }

    getImagem() {
        return this.#imagem;
    }

    // Setters com validação
    setTitulo(titulo) {
        if (!Book.validarTitulo(titulo)) {
            throw new Error('Título inválido: ' + titulo);
        }
        this.#titulo = titulo;
    }

    setAutor(autor) {
        if (!Book.validarAutor(autor)) {
            throw new Error('Autor inválido: ' + autor);
        }
        this.#autor = autor;
    }

    setGenero(genero) {
        if (!Book.validarGenero(genero)) {
            throw new Error('Gênero inválido: ' + genero);
        }
        this.#genero = genero;
    }

    setStatus(status) {
        if (!Book.validarStatus(status)) {
            throw new Error('Status inválido: ' + status);
        }
        this.#status = status;
    }

    setNota(nota) {
        if (!Book.validarNota(nota)) {
            throw new Error('Nota inválida: ' + nota);
        }
        this.#nota = nota;
    }

    setReview(review) {
        if (!Book.validarReview(review)) {
            throw new Error('Review inválido: ' + review);
        }
        this.#review = review;
    }

    setImagem(imagem) {
        this.#imagem = imagem;
    }

    // Métodos de validação
    static validarTitulo(titulo) {
        return titulo && titulo.length >= 1 && titulo.length <= 100;
    }

    static validarAutor(autor) {
        return autor && autor.length >= 2 && autor.length <= 70;
    }

    static validarGenero(genero, generosValidos = []) {
        return genero && genero.length >= 2 && genero.length <= 50
    }

    static validarStatus(status) {
        return status && status.length >= 2 && status.length <= 50;
    }

    static validarNota(nota) {
        return nota !== undefined && nota >= 0 && nota <= 10;
    }

    static validarReview(review) {
        return review && review.length >= 2 && review.length <= 500;
    }
}

export default Book;
