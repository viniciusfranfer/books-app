import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database';
import { useAuth } from '../utils/context/authContext';
import NavBar from '../components/NavBar';
import './styles/Page.css';

export default function Page() {
    const { currentUser } = useAuth();
    const [allBooks, setAllBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const navigate = useNavigate();

    const generosDisponiveis = [
        "Fantasia",
        "Ficção científica",
        "Distopia",
        "Ação e aventura",
        "Ficção Policial",
        "Horror",
        "Thriller e Suspense",
        "Ficção histórica",
        "Romance",
        "Novela",
        "Ficção Feminina",
        "LGBTQ+",
        "Ficção Contemporânea",
        "Realismo mágico",
        "Graphic Novel",
        "Conto",
        "Jovem adulto",
        "Novo Adulto",
        "Infantil",
        "Memórias e autobiografia",
        "Biografia",
        "Gastronomia",
        "Arte e Fotografia",
        "Autoajuda",
        "História",
        "Viagem",
        "Crimes Reais",
        "Humor",
        "Ensaios",
        "Guias & Como fazer",
        "Religião e Espiritualidade",
        "Humanidades e Ciências Sociais",
        "Paternidade e família",
        "Tecnologia e Ciência",
        "Negócios e Economia",
        "Política",
        "Filosofia",
        "Esportes e Lazer",
        "Quadrinhos",
        "Mangá",
        "Poesia",
        "Outro"
    ];

    useEffect(() => {
        const fetchBooks = async () => {
            if (currentUser) {
                const db = getDatabase();
                const dbRef = ref(db, `livros/${currentUser.uid}`);
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const booksList = data ? Object.values(data) : [];
                    setAllBooks(booksList);
                    setFilteredBooks(booksList);
                }
            }
        };

        fetchBooks();
    }, [currentUser]);

    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
        const filtered = allBooks.filter((book) => book.genero === genre);
        setFilteredBooks(filtered);
    };

    // const handleShowAll = () => {
    //     setSelectedGenre('');
    //     setFilteredBooks(allBooks);
    // };

    return (
        <div>
            <NavBar />
            <div className="home-container">
                <h2>Filtrar por Gênero</h2>
                <div className="genre-buttons">
                    <div className="genre-buttons-container">
                        {generosDisponiveis.map((genero) => (
                            <button
                                key={genero}
                                className={`genre-button ${selectedGenre === genero ? 'active' :                ''}`}
                                onClick={() => handleGenreClick(genero)}
                            >
                                {genero}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="books-grid">
                {filteredBooks.length > 0 ? (
                    filteredBooks.map((book) => (
                        <div key={book.id} className="book-card-home" onClick={() => navigate(`/book/${book.id}`)}>
                            <img src={book.imagem || 'https://via.placeholder.com/150'} alt={book.titulo} className="book-image" />
                            <h3>{book.titulo}</h3>
                            <p>{book.autor}</p>
                        </div>
                    ))
                ) : (
                    <p>Nenhum livro encontrado para o gênero selecionado.</p>
                )}
            </div>

                <div className="navigation-links">
                    <Link to="/books" className="nav-link">Ver Todos os Livros</Link>
                    <Link to="/booklist" className="nav-link">Ver Listas de Livros</Link>
                </div>
            </div>
        </div>
    );
}
