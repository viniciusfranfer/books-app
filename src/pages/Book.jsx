import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../utils/context/authContext/index';
import NavBar from '../components/NavBar';
import BackBtn from '../components/BackBtn';
import ModalDelete from '../components/ModalDelete';
import { generosDisponiveis, statusDisponiveis } from './AddBook';
import './styles/Book.css';
import BookDAO from '../model/BookDAO'; // Ajuste o caminho conforme necessário

export default function Book() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    
    const [titulo, setTitulo] = useState('');
    const [autor, setAutor] = useState('');
    const [genero, setGenero] = useState('');
    const [status, setStatus] = useState('');
    const [nota, setNota] = useState('');
    const [review, setReview] = useState('');
    const [imagem, setImagem] = useState('');
    const [file, setFile] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const bookDAO = new BookDAO(); // Instancia o BookDAO

    useEffect(() => {
        const fetchBookData = async () => {
            if (currentUser && id) {
                try {
                    const bookData = await bookDAO.obterLivroPeloID(currentUser.uid, id);
                    if (bookData) {
                        setBook(bookData);
                        setTitulo(bookData.titulo);
                        setAutor(bookData.autor);
                        setGenero(bookData.genero);
                        setStatus(bookData.status);
                        setNota(bookData.nota);
                        setReview(bookData.review);
                        setImagem(bookData.imagem);
                    } else {
                        console.log("Livro não encontrado.");
                    }
                } catch (error) {
                    console.error("Erro ao buscar o livro:", error);
                }
            }
        };
    
        fetchBookData();
    }, [currentUser, id]);
    

    const handleSave = async () => {
        if (currentUser && id) {
            const updatedBook = {
                id, 
                titulo,
                autor,
                genero,
                status,
                nota,
                review,
                imagem, 
            };
    
            if (file) {
                const storage = getStorage();
                const storageReference = storageRef(storage, `BookCovers/${currentUser.uid}/${id}/${file.name}`);
                await uploadBytes(storageReference, file);
                const downloadURL = await getDownloadURL(storageReference);
                updatedBook.imagem = downloadURL;
                setImagem(downloadURL);
            }
    
            await bookDAO.alterar(currentUser.uid, updatedBook);
            setIsEditing(false);
        }
    };
    
    

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagem(reader.result); 
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleDelete = async () => {
        if (currentUser && book) { 
            try {
                await bookDAO.excluir(currentUser.uid, book); 
                navigate('/books'); 
            } catch (error) {
                console.error("Erro ao excluir o livro:", error);
            }
        }
    };
    
    return (
        <div>
            <NavBar />
            <div className="book-details-container">
                {isEditing ? (
                    <div>
                        <input 
                            type="text" 
                            value={titulo} 
                            onChange={(e) => setTitulo(e.target.value)} 
                            placeholder="Título"
                        />
                        <input 
                            type="text" 
                            value={autor} 
                            onChange={(e) => setAutor(e.target.value)} 
                            placeholder="Autor"
                        />
                        <select
                            name="genero"
                            id="genero"
                            value={genero}
                            onChange={(e) => setGenero(e.target.value)}
                        >
                            <option value="" disabled>Selecione um gênero</option>
                            {generosDisponiveis.map((genero, index) => (
                                <option key={index} value={genero}>
                                    {genero}
                                </option>
                            ))}
                        </select>
                        <select
                            name="status"
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)} 
                        > 
                            {statusDisponiveis.map((status, index) => (
                                <option key={index} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <input 
                            type="number" 
                            value={nota} 
                            onChange={(e) => setNota(e.target.value)} 
                            min={1} max={5}
                            placeholder="Nota"
                        />
                        <textarea 
                            value={review} 
                            onChange={(e) => setReview(e.target.value)} 
                            placeholder="Resenha"
                            rows={4}
                            cols={50}
                        />
                        <input 
                            type="file" 
                            onChange={handleImageChange}
                        />
                        {imagem && <img src={imagem} alt="imagem capa" className="book-image" />}
                        <div className="button-container">
                            <p className='btn-save' onClick={handleSave}>Salvar</p>
                            <p className='btn-cancel' onClick={() => setIsEditing(false)}>Cancelar</p>
                        </div>
                    </div>
                ) : (
                    <div className='book-info'>
                        <BackBtn path="/books">Voltar</BackBtn>
                        <img src={imagem || 'https://via.placeholder.com/150'} alt={titulo} className="book-image" />
                        <h2>{titulo}</h2>
                        <p><strong>Autor:</strong> {autor}</p>
                        <p><strong>Gênero:</strong> {genero}</p>
                        <p><strong>Status:</strong> {status}</p>
                        <p><strong>Nota:</strong> {nota}★</p>
                        <p><strong>Resenha:</strong> {review}</p>
                        <div className='button-container'>
                            <p className='btn-edit' onClick={() => setIsEditing(true)}>Editar</p>
                            <p className='btn-delete' onClick={() => setShowModal(true)}>Excluir</p>
                        </div>
                    </div>
                )}
            </div>
            <ModalDelete 
                showModal={showModal} 
                onClose={() => setShowModal(false)} 
                onDelete={handleDelete} 
            />
        </div>
    );
}