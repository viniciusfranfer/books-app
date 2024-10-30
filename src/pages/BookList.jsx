import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../utils/context/authContext/index';
import NavBar from '../components/NavBar';
import BookListDAO from '../model/BookListDAO'; // Certifique-se de importar o DAO

import './styles/BookList.css';

Modal.setAppElement('#root');

export default function BookList() {
  const [lists, setLists] = useState({});
  const [listName, setListName] = useState('');
  const [bookData, setBookData] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState({});
  const { currentUser } = useAuth();
  const bookListDAO = new BookListDAO();

  useEffect(() => {
    const fetchListsAndBooks = async () => {
      if (currentUser) {
        try {
          const listsData = await bookListDAO.obterListas(currentUser.uid);
          const booksData = await bookListDAO.obterLivrosDoUsuario(currentUser.uid);
          setLists(listsData);
          setBookData(booksData);
        } catch (error) {
          console.error("Erro ao carregar listas e livros:", error);
        }
      }
    };
    fetchListsAndBooks();
  }, [currentUser]);

  const handleCreateList = async () => {
    if (currentUser && listName.trim()) {
      try {
        const novaLista = await bookListDAO.criarLista(currentUser.uid, listName);
        setLists((prevLists) => ({
          ...prevLists,
          [novaLista.id]: novaLista,
        }));
        setListName('');
      } catch (error) {
        console.error("Erro ao criar lista:", error);
      }
    }
  }

  

  const handleOpenModal = (listId) => {
    setSelectedListId(listId);
    setSelectedBooks(lists[listId]?.books || {});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooks({});
  };

  const handleToggleBook = (bookId) => {
    setSelectedBooks((prevSelectedBooks) => ({
      ...prevSelectedBooks,
      [bookId]: !prevSelectedBooks[bookId] ? true : undefined,
    }));
  };

  const handleSaveBooks = async () => {
    if (currentUser && selectedListId) {
      try {
        await bookListDAO.atualizarLivrosDaLista(currentUser.uid, selectedListId, selectedBooks);

        setLists((prevLists) => {
          const updatedListBooks = { ...selectedBooks };
          const cleanedBooks = Object.keys(updatedListBooks)
            .filter((bookId) => updatedListBooks[bookId])
            .reduce((acc, bookId) => {
              acc[bookId] = true;
              return acc;
            }, {});

          return {
            ...prevLists,
            [selectedListId]: {
              ...prevLists[selectedListId],
              books: cleanedBooks,
            },
          };
        });

        handleCloseModal();
      } catch (error) {
        console.error("Erro ao salvar livros na lista:", error);
      }
    }
  }

  const handleDeleteList = async (listId) => {
    if (currentUser && listId) {
        try {
            await bookListDAO.excluirLista(currentUser.uid, listId);
            setLists((prevLists) => {
                const updatedLists = { ...prevLists };
                delete updatedLists[listId];
                return updatedLists;
            });
        } catch (error) {
            console.error("Erro ao excluir lista:", error);
        }
    }
  }

  return (
    <div>
      <NavBar />
      <div className="list-container">
        <h2>Minhas Listas</h2>
        <div className="create-list">
          <input
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="Nome da nova lista"
          />
          <button onClick={handleCreateList}>Criar Lista</button>
        </div>

        <div className="existing-lists">
          {Object.keys(lists).map((listId) => (
            <div key={listId} className="list-card">
              <h3>{lists[listId].name}</h3>
              <div className="books-in-list">
                {Object.keys(lists[listId].books || {}).map((bookId) => (
                  <div key={bookId} className="book-item">
                    {bookData.find((book) => book.id === bookId)?.titulo || 'Livro'}
                  </div>
                ))}
              </div>
              <button onClick={() => handleOpenModal(listId)}>Adicionar Livros</button>
              <button className="delete-list-btn" onClick={() => handleDeleteList(listId)}>Excluir</button>
            </div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} contentLabel="Selecionar Livros">
        <h2>Selecionar Livros</h2>
        <div className="book-selection">
          {bookData.map((book) => (
            <div key={book.id} className="book-option">
              <input
                type="checkbox"
                checked={!!selectedBooks[book.id]}
                onChange={() => handleToggleBook(book.id)}
              />
              <span>{book.titulo}</span>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button onClick={handleSaveBooks}>Salvar</button>
          <button onClick={handleCloseModal}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
}
