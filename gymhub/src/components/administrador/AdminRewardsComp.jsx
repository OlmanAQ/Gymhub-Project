import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import { Edit, Trash, Search, Paintbrush } from 'lucide-react';
import '../../css/AdminRewardsComp.css'; 

const AdminRewardsComp = ({ role, onShowAddRewards }) => {
  const [rewards, setRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRewards, setFilteredRewards] = useState([]);

 
  const fetchRewards = async () => {
    try {
      const docRef = doc(db, 'rewards', 'ogEwaWZFoRvMzBBwA3QX'); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const rewardsData = docSnap.data();
        console.log(rewardsData);
        const rewardsList = Object.keys(rewardsData).map((key) => ({
          id: key,
          ...rewardsData[key],
        }));
        setRewards(rewardsList);
        setFilteredRewards(rewardsList);
      } else {
        console.log('No se encontró el documento de premios.');
      }
    } catch (error) {
      console.error('Error al obtener los premios: ', error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: '¿Eliminar premio?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const docRef = doc(db, 'rewards', 'ogEwaWZFoRvMzBBwA3QX'); 
          await updateDoc(docRef, {
            [id]: deleteField(),
          });

          const updatedRewards = rewards.filter(reward => reward.id !== id);
          setRewards(updatedRewards);
          setFilteredRewards(updatedRewards);

          Swal.fire('¡Muy bien!', 'El premio ha sido eliminado', 'success');
        } catch (error) {
          console.error('Error al eliminar el premio: ', error);
          Swal.fire('Error', 'Hubo un error al eliminar el premio.', 'error');
        }
      }
    });
  };

 
  const handleSearch = () => {
    const results = rewards.filter((reward) =>
      reward.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRewards(results);
  };


  const handleRefresh = () => {
    setFilteredRewards(rewards);
    setSearchTerm('');
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  return (
    <div className="cont-principal">
      <div> 
        <h1 className="titulo">Premios</h1>
      </div>

      <div className='container-buttons'>
        <div className='flex-container'>
          <input
            type="text"
            placeholder="Buscar premio"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-flex"
          />
          <button className="search-button-flex" onClick={handleSearch}>
            <Search size={28} color="#007BFF" />
          </button>
          <button className="button-refresh" onClick={handleRefresh}>
            <Paintbrush size={28} color="#007BFF" />
          </button>
        </div>

        {role === 'admin' && (
          <button className="button-create" onClick={onShowAddRewards}> Agregar premio </button>
        )}
      </div>

      <div className="suplementos-container">
        {filteredRewards.length > 0 ? (
          filteredRewards.map((reward) => (
            <div key={reward.id} className="suplemento-card">
              <div>
                <img src={reward.url} alt={reward.id} className="suplemento-img" />
                <h2>{reward.id}</h2>
                <p>Descripción: {reward.descripcion}</p>
                <p>Ganador: {reward.ganador}</p>
                <p>Válido hasta: {reward.valido}</p>
                <p>Estado: {reward.estado}</p>
              </div>
              {role === 'admin' && (
                <div className="container-DE">
                  <button className="button-sec" onClick={() => handleDelete(reward.id)}>
                    <Trash size={28} color="#FF5C5C" />
                    Eliminar
                  </button>
                  <button className="button-sec">
                    <Edit size={28} color="#F7E07F" />
                    Editar
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay premios disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default AdminRewardsComp;
