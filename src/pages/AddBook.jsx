import { useState, useEffect } from 'react';
// import { get, getDatabase, ref, set } from 'firebase/database';
// import { imageDb } from '../utils/auth/firebase';
import { useAuth } from '../utils/context/authContext/index';
import NavBar from '../components/NavBar';
import BackBtn from '../components/BackBtn';
import BookDAO from '../model/BookDAO';
import './styles/AddBook.css';
// import { v4 } from 'uuid';
// import { listAll, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const statusDisponiveis = [
    "Lendo",
    "Quero ler",
    "Lido",
    "Relendo",
    "Abandonado"
];

function AddBook() {
    const { currentUser } = useAuth();
    const [img, setImg] = useState(null);
    const [coverPic, setCoverPic] = useState(null);
    const [bookData, setBookData] = useState({
        titulo: '',
        autor: '',
        genero: '',
        status: 'Lendo',
        nota: '',
        review: '',
    });

    const onSubmit = async (e) => {
        e.preventDefault();
    
        if (!img) {
            console.error('Imagem é obrigatória');
            return;
        }
    
        try {
            const bookDAO = new BookDAO();
            await bookDAO.incluir(currentUser.uid, bookData, img);
            console.log('Livro adicionado com sucesso!');
    
            setBookData({ titulo: '', autor: '', genero: '', status: '', nota: '', review: '' });
            setCoverPic(null);
            setImg(null);
        } catch (error) {
            console.error('Erro ao adicionar livro:', error);
        }
    };
    

    const handleCoverPicChange = (e) => {
        setImg(e.target.files[0]);
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCoverPic(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInput = (e) => {
        setBookData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    return (
    <div>
        <NavBar />
        <div className="add-book-container">
        <BackBtn path={"/books"}/>
            <h2>Adicionar Livro</h2>
            <form className="add-book-form" onSubmit={onSubmit}>
                <label htmlFor="imagem">Imagem</label>
                    <img
                        src={coverPic || 'https://via.placeholder.com/150'}
                        alt="Foto da capa"
                        className="cover-pic"
                    />
                <input type="file" onChange={handleCoverPicChange}/>
                <label htmlFor="titulo">Título</label>
                <input
                    type="text"
                    name="titulo"
                    id="titulo"
                    value={bookData.titulo}
                    onChange={handleInput}
                />
                <label htmlFor="autor">Autor</label>
                <input
                    type="text"
                    name="autor"
                    id="autor"
                    value={bookData.autor}
                    onChange={handleInput}
                />
                <label htmlFor="genero">Gênero</label>
                <select
                    name="genero"
                    id="genero"
                    value={bookData.genero}
                    onChange={handleInput}
                >
                    <option value="" disabled>Selecione um gênero</option>
                    {generosDisponiveis.map((genero, index) => (
                        <option key={index} value={genero}>
                            {genero}
                        </option>
                    ))}
                </select>
                <label htmlFor="status">Status</label>
                <select
                    name="status"
                    id="status"
                    value={bookData.status}
                    onChange={handleInput}
                > 
                    {statusDisponiveis.map((status, index) => (
                        <option key={index} value={status}>
                            {status}
                        </option>
                    ))}
                </select>
                <label htmlFor="nota">Nota</label>
                <input
                    type="number"
                    name="nota"
                    id="nota"
                    value={bookData.nota}
                    onChange={handleInput}
                    min={1}
                    max={5}
                />
                <label htmlFor="review">Resenha</label>
                <textarea
                    name="review"
                    id="review"
                    value={bookData.review}
                    onChange={handleInput}
                    rows="4" 
                    cols="40"
                />
                <button type="submit" className='add-book-link'>Adicionar Livro</button>
            </form>
        
        </div>
    </div>
  )
}

export { generosDisponiveis, statusDisponiveis } 
export  default AddBook