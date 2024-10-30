import React, { useEffect, useState } from 'react';
import { useAuth } from '../utils/context/authContext/index';
import './styles/Profile.css';
import NavBar from '../components/NavBar';
import UserDAO from '../model/UserDAO.JS'; 
import { getDatabase, ref, get } from 'firebase/database';

function Profile() {
    const { currentUser } = useAuth();
    const [userData, setUserData] = useState({ nome: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (currentUser) {
            const fetchUserData = async () => {
                const db = getDatabase();
                const dbRef = ref(db, `usuarios/${currentUser.uid}`);
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    setUserData(snapshot.val());
                } else {
                    console.log("No data available");
                }
            };

            fetchUserData();
        }
    }, [currentUser]);

    // const handleEditToggle = () => {
    //     setIsEditing(!isEditing);
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const userDAO = new UserDAO(); // Criação da instância

    //     try {
    //         await userDAO.alterarNomeEmail(currentUser.uid, userData.nome, userData.email);
    //         console.log('Dados atualizados com sucesso');
    //     } catch (error) {
    //         console.error('Erro ao atualizar os dados:', error);
    //     }
    // };

    if (!currentUser) {
        return <div>Carregando...</div>;
    }

    return (
        <div className='container1'>
            <NavBar />
            <div className="profile-container">
                <h2>Perfil do Usuário</h2>
                <div className="profile-info">
                    <label>Nome:</label>
                    <input
                        type="text"
                        value={userData.nome}
                        onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                        disabled={!isEditing}
                    />
                    <label>Email:</label>
                    <input
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        disabled={!isEditing}
                    />
                </div>
                {/* <div className="buttons">
                    <button onClick={handleEditToggle} className="edit-btn">
                        {isEditing ? 'Cancelar' : 'Editar'}
                    </button>
                    {isEditing && (
                        <button onClick={handleSubmit} className="save-btn">
                            Salvar
                        </button>
                    )}
                </div> */}
            </div>
        </div>
    );
}

export default Profile;