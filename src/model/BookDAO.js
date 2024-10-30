import { getDatabase, ref, query, orderByChild, equalTo, get, set, remove } from "firebase/database";
import { v4 as uuidv4 } from 'uuid';
import { imageDb } from '../utils/auth/firebase';
import { uploadBytes, getDownloadURL, ref as sRef } from 'firebase/storage';
import Book from "./Book.js";
import BookDTO from "./BookDTO.js";
import ModelError from "./ModelError.js";

export default class BookDAO {

    static promessaConexao = null;

    constructor() {
        this.obterConexao();
    }

    async obterConexao() {
        if (BookDAO.promessaConexao == null) {
            BookDAO.promessaConexao = new Promise((resolve, reject) => {
                const db = getDatabase();
                if (db) resolve(db);
                else reject(new ModelError("Não foi possível estabelecer conexão com o BD"));
            });
        }
        return BookDAO.promessaConexao;
    }

    async obterLivroPeloID(userId, id) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            const dbRefLivro = ref(connectionDB, `livros/${userId}/${id}`);
            get(dbRefLivro)
                .then((dataSnapshot) => {
                    const livro = dataSnapshot.val();
                    if (livro) {
                        resolve(livro); // Retorna os dados brutos do livro
                    } else {
                        reject(new ModelError("Livro não encontrado."));
                    }
                })
                .catch((error) => reject(error));
        });
    }
    
    
    
    

    async obterLivroPeloTitulo(titulo) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve) => {
            let dbRefLivro = ref(connectionDB, 'livros');
            let paramConsulta = orderByChild('titulo');
            let paramEqual = equalTo(titulo);
            let consulta = query(dbRefLivro, paramConsulta, paramEqual);
            let resultPromise = get(consulta);
            resultPromise.then(dataSnapshot => {
                let livro = dataSnapshot.val();
                if (livro != null)
                    resolve(new Book(livro.id, livro.titulo, livro.autor, livro.genero, livro.status, livro.nota, livro.review));
                else
                    resolve(null);
            });
        });
    }

    async obterLivros() {
        let connectionDB = await this.obterConexao();

        return new Promise((resolve) => {
            let conjLivros = [];
            let dbRefLivros = ref(connectionDB, 'livros');
            let paramConsulta = orderByChild('titulo');
            let consulta = query(dbRefLivros, paramConsulta);
            let resultPromise = get(consulta);
            resultPromise.then(dataSnapshot => {
                dataSnapshot.forEach(dataSnapshotObj => {
                    let elem = dataSnapshotObj.val();
                    conjLivros.push(new Book(elem.id, elem.titulo, elem.autor, elem.genero, elem.status, elem.nota, elem.review));
                });
                resolve(conjLivros);
            }, (e) => console.log("#" + e));
        });
    }

    async obterLivrosDoUsuario(userId) {
        let connectionDB = await this.obterConexao();
        return new Promise((resolve, reject) => {
            const dbRef = ref(connectionDB, `livros/${userId}`);
            get(dbRef)
                .then((snapshot) => {
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const booksList = data ? Object.values(data) : [];
                        resolve(booksList);
                    } else {
                        resolve([]);
                    }
                })
                .catch((error) => reject(error));
        });
    }
    
    async incluir(userId, livroData, img) {
        let connectionDB = await this.obterConexao();
        const livroId = uuidv4(); 
    
        if (!img) throw new ModelError("Imagem do livro é obrigatória");
    
        const imgRef = sRef(imageDb, `BookCovers/${livroId}`);
        
        const snapshot = await uploadBytes(imgRef, img);
        const url = await getDownloadURL(snapshot.ref);
    
        const livroDTO = new BookDTO({
            ...livroData,
            imagem: url,
            id: livroId 
        });
    
        return new Promise((resolve, reject) => {
            let dbRefLivro = ref(connectionDB, `livros/${userId}/${livroId}`);
            set(dbRefLivro, livroDTO)
                .then(() => resolve(true))
                .catch(erro => reject(erro));
        });
    }
    
    

    async alterar(userId, livro) {
        let connectionDB = await this.obterConexao();
    
        return new Promise((resolve, reject) => {
            if (!livro.id) { 
                reject(new ModelError("ID do livro é obrigatório"));
                return;
            }
            
            let dbRefLivro = ref(connectionDB, `livros/${userId}/${livro.id}`); // Acesse diretamente a propriedade id
            let setPromise = set(dbRefLivro, new BookDTO(livro));
            setPromise.then(() => resolve(true)).catch(erro => reject(erro));
        });
    }
    
    

    async excluir(userId, livro) {
        let connectionDB = await this.obterConexao();
        
        return new Promise((resolve, reject) => {
            if (!livro.id) { 
                reject(new ModelError("ID do livro é obrigatório"));
                return;
            }
            
            let dbRefLivro = ref(connectionDB, `livros/${userId}/${livro.id}`); // 
            let removePromise = remove(dbRefLivro);
            removePromise.then(() => resolve(true)).catch(erro => reject(erro));
        });
    }
    
}
