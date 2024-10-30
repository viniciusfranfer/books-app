import { useEffect, useState } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useAuth } from '../utils/context/authContext/index';
import NavBar from '../components/NavBar';
import './styles/Books.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Books() {
    const [bookData, setBookData] = useState([]); // Inicializar como array vazio
    const { currentUser } = useAuth();
    const navigate = useNavigate();    

    useEffect(() => {
        const fetchBookData = async () => {
            if (currentUser) {
                const db = getDatabase();
                const dbRef = ref(db, `livros/${currentUser.uid}`);
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const booksList = data ? Object.values(data) : [];
                    setBookData(booksList);
                } else {
                    console.log("No data available");
                }
            }
        };

        fetchBookData();
    }, [currentUser]);

    const handleBookClick = (bookId) => {
      navigate(`/book/${bookId}`);
    };

    return (
        <div>
            <NavBar />
            <div className="books-container">
                <Link to="/addbook" className="add-book-link">Adicionar Livro</Link>
                <h2>Meus Livros</h2>
                <div className="books-grid-books">
                    {bookData.map((book) => (
                        <div key={book.id} className="book-card-book" onClick={() => handleBookClick(book.id)}>
                            <img src={book.imagem || 'https://via.placeholder.com/150'} alt={book.titulo} className="books-image" />
                            <h3 className="book-title">{book.titulo}</h3>
                            <p className="book-author">{book.autor}</p>
                            <p className="book-genre">{book.nota}☆</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
