import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import { Edit, Trash, Search, Paintbrush } from 'lucide-react';
import '../../css/AdminRewardsComp.css'; 

const AdminRewardsComp = ({ role, onShowAddRewards, onShowEditRewards }) => {
  const [rewards, setRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [isSearching, setIsSearching] = useState(false); 
  const [selectedState, setSelectedState] = useState('');

  const userRole = useSelector((state) => state.user.rol);
  console.log(userRole);

  const pageSize = 8; 

  const fetchRewards = async (search = false) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rewards'));
      const rewardsList = querySnapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data(), 
      }));

      if (!search) {
        setRewards(rewardsList);
        setFilteredRewards(rewardsList.slice(0, pageSize)); 
      }
    } catch (error) {
      console.error('Error al obtener los premios: ', error);
    }
  };

  const loadMore = () => {
    if (isSearching) {
      const results = rewards.filter((reward) =>
        reward.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const nextRewards = results.slice(filteredRewards.length, filteredRewards.length + pageSize);
      setFilteredRewards((prevRewards) => [...prevRewards, ...nextRewards]);
    } else {
      const nextRewards = rewards.slice(filteredRewards.length, filteredRewards.length + pageSize);
      setFilteredRewards((prevRewards) => [...prevRewards, ...nextRewards]);
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
          await deleteDoc(doc(db, 'rewards', id)); 
          const updatedRewards = rewards.filter(reward => reward.id !== id);
          setRewards(updatedRewards);
          setFilteredRewards(updatedRewards.slice(0, pageSize)); 

          Swal.fire('¡Muy bien!', 'El premio ha sido eliminado', 'success');
        } catch (error) {
          console.error('Error al eliminar el premio: ', error);
          Swal.fire('Error', 'Hubo un error al eliminar el premio.', 'error');
        }
      }
    });
  };

  const handleStateChange = (value) =>{
    setSelectedState(value);
  }

  const handleSearch = () => {
    const results = rewards.filter((reward) =>
      reward.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRewards(results.slice(0, pageSize)); 
    setIsSearching(true); 
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setFilteredRewards(rewards.slice(0, pageSize)); 
    setIsSearching(false); 
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

        <div>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="select-tp"
          >
            <option value="">Seleccionar estado</option> 
            <option value="sinreclamar">Sin reclamar</option>
            <option value="reclamado">Reclamado</option>
            <option value="vencido">Vencido</option>
          </select>

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
                <img src={reward.url} alt={reward.nombre} className="suplemento-img" />
                <h2>{reward.nombre}</h2>
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
                  <button className="button-sec" onClick={() => onShowEditRewards(reward)}>
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

      {(filteredRewards.length < (isSearching 
        ? rewards.filter((reward) => reward.nombre.toLowerCase().includes(searchTerm.toLowerCase())).length 
        : rewards.length)) && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={loadMore}>
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminRewardsComp;
