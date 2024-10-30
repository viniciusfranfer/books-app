import { useEffect, useState } from 'react';
import { getDatabase, ref, set, get, push, update, remove } from 'firebase/database';
import Modal from 'react-modal';
import { useAuth } from '../utils/context/authContext/index';
import NavBar from '../components/NavBar';
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

  useEffect(() => {
    const fetchLists = async () => {
      if (currentUser) {
        const db = getDatabase();
        const listsRef = ref(db, `listas/${currentUser.uid}`);
        const snapshot = await get(listsRef);
        if (snapshot.exists()) {
          setLists(snapshot.val());
        }
      }
    };

    const fetchBooks = async () => {
      if (currentUser) {
        const db = getDatabase();
        const booksRef = ref(db, `livros/${currentUser.uid}`);
        const snapshot = await get(booksRef);
        if (snapshot.exists()) {
          const booksList = snapshot.val() ? Object.values(snapshot.val()) : [];
          setBookData(booksList);
        }
      }
    };

    fetchLists();
    fetchBooks();
  }, [currentUser]);

  const handleCreateList = async () => {
    if (currentUser && listName.trim()) {
      const db = getDatabase();
      const listsRef = ref(db, `listas/${currentUser.uid}`);
      const newListRef = push(listsRef);
      const newListData = { name: listName, books: {} };

      await set(newListRef, newListData);
      const newListId = newListRef.key;

      setLists((prevLists) => ({
        ...prevLists,
        [newListId]: newListData,
      }));
      
      setListName('');
    }
  };

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
        const db = getDatabase();
        const updates = {};

        Object.keys(selectedBooks).forEach((bookId) => {
            if (selectedBooks[bookId]) {
                updates[`listas/${currentUser.uid}/${selectedListId}/books/${bookId}`] = true;
            } else {
                updates[`listas/${currentUser.uid}/${selectedListId}/books/${bookId}`] = null;
            }
        });

        await update(ref(db), updates);

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
              <button onClick={() => handleOpenModal(listId)}>Adicionar/Editar Livros</button>
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