import { getDatabase, ref, query, orderByChild, equalTo, get, set, remove } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import ModelError from "./ModelError.js";
import BookList from "./BookList.js";
import BookListDTO from "./BookListDTO.js";

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

    async obterListaPeloID(id) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve) => {
            let dbRefLista = ref(connectionDB, 'listas/' + id);
            let consulta = query(dbRefLista);
            let resultPromise = get(consulta);
            resultPromise.then(dataSnapshot => {
                let lista = dataSnapshot.val();
                if (lista != null) {
                    resolve(new BookList(lista.id, lista.nome, lista.livros));
                } else {
                    resolve(null);
                }
            });
        });
    }

    async obterListas() {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve) => {
            let conjListas = [];
            let dbRefListas = ref(connectionDB, 'listas');
            let paramConsulta = orderByChild('nome');
            let consulta = query(dbRefListas, paramConsulta);
            let resultPromise = get(consulta);
            resultPromise.then(dataSnapshot => {
                dataSnapshot.forEach(dataSnapshotObj => {
                    let elem = dataSnapshotObj.val();
                    // A partir do snapshot, você precisa garantir que `elem.id`, `elem.nome`, e `elem.livros` existam
                    conjListas.push(new BookList(elem.id, elem.nome, elem.livros || [])); // Corrigido para `elem.nome` e `elem.livros`
                });
                resolve(conjListas);
            }, (e) => console.log("#" + e));
        });
    }
    


    async incluir(userId, bookListData) {
        let connectionDB = await this.obterConexao();
        const bookListId = uuidv4(); // Gera um novo ID para a lista
    
        return new Promise((resolve, reject) => {
            let dbRefLista = ref(connectionDB, `listas/${userId}/${bookListId}`);
            
            // Cria uma instância de BookList antes de passar para BookListDTO
            const bookList = new BookList(bookListId, bookListData.nome, bookListData.livros || []);
            const bookListDTO = new BookListDTO(bookList); // Agora passa um objeto BookList
    
            set(dbRefLista, bookListDTO)
                .then(() => resolve(true))
                .catch(erro => reject(erro));
        });
    }
    
    
    

    async alterar(userId, bookList) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            // Usa o método getIdLista() para obter o ID da lista
            const bookListId = bookList.getIdLista();
            
            if (!bookListId) {
                reject(new ModelError("ID da lista é obrigatório"));
                return;
            }
    
            let dbRefLista = ref(connectionDB, `listas/${userId}/${bookListId}`);
            let setPromise = set(dbRefLista, new BookListDTO(bookList));
            setPromise.then(() => resolve(true)).catch(erro => reject(erro));
        });
    }

    async excluir(userId, bookList) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            if (!bookList.id) {
                reject(new ModelError("ID da lista é obrigatório"));
                return;
            }

            let dbRefLista = ref(connectionDB, `listas/${userId}/${bookList.id}`);
            let removePromise = remove(dbRefLista);
            removePromise.then(() => resolve(true)).catch(erro => reject(erro));
        });
    }
}
