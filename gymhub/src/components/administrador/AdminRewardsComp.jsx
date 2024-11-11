import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import { Edit, Trash, Search, Paintbrush } from 'lucide-react';
import '../../css/AdminRewardsComp.css'; 

const AdminRewardsComp = ({ onShowAddRewards, onShowEditRewards }) => {
  const [rewards, setRewards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [isSearching, setIsSearching] = useState(false); 
  const [selectedState, setSelectedState] = useState('');
  const userRole = useSelector((state) => state.user.role);
  const pageSize = 8; 

  const fetchRewards = async (search = false) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'rewards'));
      let rewardsList = querySnapshot.docs.map((doc) => ({
        id: doc.id, 
        ...doc.data(), 
      }));

      switch (selectedState) {
        case 'todos':
          rewardsList = rewardsList;
          break;
        case 'sinreclamar':
          rewardsList = rewardsList.filter(reward => reward.estado === 'sin reclamar');
          break;
        case 'reclamado':
          rewardsList = rewardsList.filter(reward => reward.estado === 'reclamado');
          break;
        case 'vencido':
          rewardsList = rewardsList.filter(reward => reward.estado === 'vencido');
          break;
        default:
          break;
      }
      if (!search) {
        setRewards(rewardsList);
        setFilteredRewards(rewardsList.slice(0, pageSize)); 
      }
    } catch (error) {
      console.error('Error al obtener los premios: ', error);
    }
  };

  const loadMore = () => {
    let results = rewards;
    if (selectedState !== 'todos') {
      switch (selectedState) {
        case 'sinreclamar':
          results = rewards.filter(reward => reward.estado === 'sin reclamar');
          break;
        case 'reclamado':
          results = rewards.filter(reward => reward.estado === 'reclamado');
          break;
        case 'vencido':
          results = rewards.filter(reward => reward.estado === 'vencido');
          break;
        default:
          break;
      }
    }
    if (isSearching) {
      results = results.filter((reward) =>
        reward.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const nextRewards = results.slice(filteredRewards.length, filteredRewards.length + pageSize);
    setFilteredRewards((prevRewards) => [...prevRewards, ...nextRewards]);
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
    let filteredRewardsByState = [...rewards]; 
    
    switch (selectedState) {
      case 'todos':
        break;
      case 'sinreclamar':
        filteredRewardsByState = filteredRewardsByState.filter(reward => reward.estado === 'sin reclamar');
        break;
      case 'reclamado':
        filteredRewardsByState = filteredRewardsByState.filter(reward => reward.estado === 'reclamado');
        break;
      case 'vencido':
        filteredRewardsByState = filteredRewardsByState.filter(reward => reward.estado === 'vencido');
        break;
      default:
        break;
    }

    const results = filteredRewardsByState.filter((reward) =>
      reward.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRewards(results.slice(0, pageSize));
    setIsSearching(true); 
  };
  
  const handleRefresh = () => {
    setSearchTerm('');
    setSelectedState('');
    setFilteredRewards(rewards.slice(0, pageSize)); 
    setIsSearching(false); 
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  useEffect(() => {
    if (isSearching !== true) { 
      fetchRewards(); 
    } else {
      handleSearch();
    }
  }, [selectedState]);


  return (
    <div className="cont-pr">
      <div> 
        <h1 className="titulo-prn">Premios</h1>
      </div>

      <div className='cont-buttons'>        
        <div className='flex-cont'>
          <input
            type="text"
            placeholder="Buscar premio"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-fl"
          />
          <button className="search-button-fl" onClick={handleSearch}>
            <Search size={28} color="#007BFF" />
          </button>
          <button className="button-rfs" onClick={handleRefresh}>
            <Paintbrush size={28} color="#007BFF" />
          </button>
        </div>

        <div>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="select-tp"
          >
            <option value="todos">Seleccionar estado</option> 
            <option value="sinreclamar">Sin reclamar</option>
            <option value="reclamado">Reclamado</option>
            <option value="vencido">Vencido</option>
          </select>

        </div>
        
        {userRole === 'Administrador' && (
          <button className="btn-create" onClick={onShowAddRewards}> Agregar premio </button>
        )}
      </div>

      <div className="rewards-container">
        {filteredRewards.length > 0 ? (
          filteredRewards.map((reward) => (
            <div key={reward.id} className="reward-card">
              <div>
                <img src={reward.url} alt={reward.nombre} className="reward-img" />
                <h2>{reward.nombre}</h2>
                <p>Descripción: {reward.descripcion}</p>
                <p>Ganador: {reward.ganador}</p>
                <p>Válido hasta: {reward.valido}</p>
                <p>Estado: {reward.estado}</p>
              </div>
              {userRole === 'Administrador' && (
                <div className="cont-DE">
                  <button className="button-aux" onClick={() => handleDelete(reward.id)}>
                    <Trash size={28} color="#FF5C5C" />
                    Eliminar
                  </button>
                  <button className="button-aux" onClick={() => onShowEditRewards(reward)}>
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

      {(filteredRewards.length < 
        (isSearching 
          ? rewards.filter((reward) => 
              reward.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            ).filter((reward) => {
              switch (selectedState) {
                case 'sinreclamar':
                  return reward.estado === 'sin reclamar';
                case 'reclamado':
                  return reward.estado === 'reclamado';
                case 'vencido':
                  return reward.estado === 'vencido';
                case 'todos':
                default:
                  return true;
              }
            }).length 
          : rewards.filter((reward) => {
              switch (selectedState) {
                case 'sinreclamar':
                  return reward.estado === 'sin reclamar';
                case 'reclamado':
                  return reward.estado === 'reclamado';
                case 'vencido':
                  return reward.estado === 'vencido';
                case 'todos':
                default:
                  return true;
              }
            }).length
        )) && (
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
