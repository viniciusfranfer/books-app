import React, { useEffect , useState } from 'react';
import { useAuth } from '../utils/context/authContext/index';
import './styles/Profile.css';
import NavBar from '../components/NavBar';
import { getDatabase, ref, get } from 'firebase/database';


function Profile() {
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  

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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para salvar os dados atualizados no banco de dados
    console.log('Dados atualizados:', userData);
    console.log(userData.nome, userData.password);
  };

  if (!currentUser) {
    return <div>Carregando...</div>;
  }


  return (
    <div className='container1'>
        <NavBar />
        <div className="profile-container">
          
          <h2>Perfil do Usuário</h2>

          <div className="profile-pic-section">
            <img
              src={profilePic || 'https://via.placeholder.com/150'}
              alt="Foto do Perfil"
              className="profile-pic"
            />
            <input type="file" onChange={handleProfilePicChange} />
          </div>

          <div className="profile-info">
            <label>Nome:</label>
            <input
              type="text"
              value={userData.nome}
              // onChange={handleChange}
              disabled={!isEditing}
            />

            <label>Email:</label>
            <input
              type="email"
              value={userData.email}
              // onChange={handleChange}
              disabled={!isEditing}
            />

            <label>Senha:</label>
            <input
              type="password"
              value={userData.password}
              // onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="buttons">
            <button onClick={handleEditToggle} className="edit-btn">
              {isEditing ? 'Cancelar' : 'Editar'}
            </button>
            {isEditing && (
              <button onClick={handleSubmit} className="save-btn">
                Salvar
              </button>
            )}
          </div>
        </div>
    </div>
  );
}

export default Profile;
