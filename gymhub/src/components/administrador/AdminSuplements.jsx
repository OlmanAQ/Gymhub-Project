import React, { useState, useEffect } from 'react';
import { doc, getDoc, deleteField, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import { Edit, Trash, Search, Paintbrush } from 'lucide-react';
import '../../css/AdminSuplements.css';

const AdminSuplemenstComp = ({ onShowAddSuplements, onShowEditSuplements, role }) => {
  const [suplementos, setSuplementos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuplementos, setFilteredSuplementos] = useState([]);
  const [isSearching, setIsSearching] = useState(false); 

  const pageSize = 8; 

  const fetchSuplementos = async (search = false) => {
    try {
      const docRef = doc(db, 'suplementslist', 'FkhKVhtSuwkyiSl7VvN9'); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const suplementosData = docSnap.data();
        const suplementosList = Object.keys(suplementosData).map((key) => ({
          id: key,
          ...suplementosData[key],
        }));

        if (!search) {
          setSuplementos(suplementosList);
          setFilteredSuplementos(suplementosList.slice(0, pageSize)); 
        }
      } else {
        console.log('No se encontró el documento.');
      }
    } catch (error) {
      console.error('Error al obtener los suplementos: ', error);
    }
  };

  const loadMore = async () => {
    if (isSearching) {
      const results = suplementos.filter((suplemento) =>
        suplemento.id.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const nextSuplementos = results.slice(filteredSuplementos.length, filteredSuplementos.length + pageSize);
      setFilteredSuplementos((prevSuplementos) => [...prevSuplementos, ...nextSuplementos]);
    } else {
      const nextSuplementos = suplementos.slice(filteredSuplementos.length, filteredSuplementos.length + pageSize);
      setFilteredSuplementos((prevSuplementos) => [...prevSuplementos, ...nextSuplementos]);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: '¿Eliminar suplemento?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const docRef = doc(db, 'suplementslist', 'FkhKVhtSuwkyiSl7VvN9');
          await updateDoc(docRef, {
            [id]: deleteField(),
          });

          const updatedSuplementos = suplementos.filter(suplemento => suplemento.id !== id);
          setSuplementos(updatedSuplementos);
          setFilteredSuplementos(updatedSuplementos.slice(0, pageSize));

          Swal.fire('Eliminado', 'El suplemento ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error al eliminar el suplemento: ', error);
          Swal.fire('Error', 'Hubo un error al eliminar el suplemento.', 'error');
        }
      }
    });
  };

  const handleSearch = () => {
    const results = suplementos.filter((suplemento) =>
      suplemento.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuplementos(results.slice(0, pageSize));
    setIsSearching(true); 
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setFilteredSuplementos(suplementos.slice(0, pageSize)); 
    setIsSearching(false); 
  };

  useEffect(() => {
    fetchSuplementos(); 
  }, []);

  return (
    <div className="cont-principal">
      <div>
        <h1 className="titulo">Suplementos</h1>
      </div>

      <div className="container-buttons">
        <div className="flex-container">
          <input
            type="text"
            placeholder="Buscar suplemento"
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
          <button className="button-create" onClick={onShowAddSuplements}>
            Agregar suplemento
          </button>
        )}
      </div>

      <div className="suplementos-container">
        {filteredSuplementos.length > 0 ? (
          filteredSuplementos.map((suplemento) => (
            <div key={suplemento.id} className="suplemento-card">
              <div>
                <img src={suplemento.url} alt={suplemento.id} className="suplemento-img" />
                <h2>{suplemento.id}</h2>
                <p>Precio: ₡{suplemento.precio}</p>
                <p>Cantidad: {suplemento.cantidad}</p>
                <p>Estado: {suplemento.disponible ? 'Disponible' : 'No disponible'}</p>
                <p>Descripción: {suplemento.descripcion || 'Sin descripción disponible'}</p>
              </div>
              {role === 'admin' && (
                <div className="container-DE">
                  <button className="button-sec" onClick={() => handleDelete(suplemento.id)}>
                    <Trash size={28} color="#FF5C5C" />
                    Eliminar
                  </button>
                  <button className="button-sec" onClick={() => onShowEditSuplements(suplemento)}>
                    <Edit size={28} color="#F7E07F" />
                    Editar
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No hay suplementos disponibles.</p>
        )}
      </div>

      {(filteredSuplementos.length < (isSearching 
        ? suplementos.filter((suplemento) => suplemento.id.toLowerCase().includes(searchTerm.toLowerCase())).length 
        : suplementos.length)) && (
        <div className="load-more-container">
          <button className="load-more-button" onClick={loadMore}>
            Cargar más
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSuplemenstComp;
