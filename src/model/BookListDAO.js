import { getDatabase, ref, get, set, push, update, remove } from "firebase/database";
import BookList from "./BookList.js";
import Book from "./Book.js";
import ModelError from "./ModelError.js";

export default class BookListDAO {
    static promessaConexao = null;

    constructor() {
        this.obterConexao();
    }

    async obterConexao() {
        if (BookListDAO.promessaConexao == null) {
            BookListDAO.promessaConexao = new Promise((resolve, reject) => {
                const db = getDatabase();
                if (db) resolve(db);
                else reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
            });
        }
        return BookListDAO.promessaConexao;
    }

    async obterListas(userId) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            const dbRefListas = ref(connectionDB, `listas/${userId}`);
            get(dbRefListas)
                .then((snapshot) => {
                    const listas = snapshot.exists() ? snapshot.val() : {};
                    resolve(listas);
                })
                .catch(error => reject(error));
        });
    }

    async obterLivrosDoUsuario(userId) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            const dbRefLivros = ref(connectionDB, `livros/${userId}`);
            get(dbRefLivros)
                .then((snapshot) => {
                    const livros = snapshot.exists() ? Object.values(snapshot.val()) : [];
                    resolve(livros); // Retorna um array vazio se não houver livros
                })
                .catch(error => reject(error));
        });
    }
    

    async criarLista(userId, nomeLista) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            const dbRefListas = ref(connectionDB, `listas/${userId}`);
            const novaListaRef = push(dbRefListas);
            const novaLista = { name: nomeLista, books: {} };

            set(novaListaRef, novaLista)
                .then(() => resolve({ id: novaListaRef.key, ...novaLista }))
                .catch(erro => reject(erro));
        });
    }

    async atualizarLivrosDaLista(userId, listaId, livrosSelecionados) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            const updates = {};
            Object.keys(livrosSelecionados).forEach((bookId) => {
                updates[`listas/${userId}/${listaId}/books/${bookId}`] = livrosSelecionados[bookId] ? true : null;
            });

            update(ref(connectionDB), updates)
                .then(() => resolve(true))
                .catch(error => reject(error));
        });
    }

    async excluirLista(userId, listId) {
        const connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            const dbRefLista = ref(connectionDB, `listas/${userId}/${listId}`);
            remove(dbRefLista)
                .then(() => resolve(true))
                .catch(error => reject(error));
        });
    }

}
