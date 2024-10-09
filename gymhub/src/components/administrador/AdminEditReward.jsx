import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AdminEditReward = ({ rewardId, onClose }) => {
  const [rewardData, setRewardData] = useState({
    nombre: '',
    descripcion: '',
    estado: '',
    ganador: '',
    url: '',
    valido: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cargar los datos del premio existente
    const fetchRewardData = async () => {
      setLoading(true);
      try {
        const rewardRef = doc(db, 'rewards', rewardId);
        const rewardSnap = await getDoc(rewardRef);
        if (rewardSnap.exists()) {
          setRewardData(rewardSnap.data());
        } else {
          console.log('No se encontró el premio.');
        }
      } catch (error) {
        console.error('Error al cargar el premio:', error);
      }
      setLoading(false);
    };

    fetchRewardData();
  }, [rewardId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRewardData({ ...rewardData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const rewardRef = doc(db, 'rewards', rewardId);
      await updateDoc(rewardRef, rewardData);
      console.log('Premio actualizado exitosamente.');
      onClose(); // Cierra el modal o componente de edición
    } catch (error) {
      console.error('Error al actualizar el premio:', error);
    }

    setLoading(false);
  };

  return (
    <div className="edit-reward-container">
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre del premio</label>
            <input
              type="text"
              name="nombre"
              value={rewardData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={rewardData.descripcion}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Estado</label>
            <select
              name="estado"
              value={rewardData.estado}
              onChange={handleChange}
              required
            >
              <option value="Reclamado">Reclamado</option>
              <option value="Sin reclamar">Sin reclamar</option>
              <option value="Vencido">Vencido</option>
            </select>
          </div>
          <div>
            <label>Ganador</label>
            <input
              type="text"
              name="ganador"
              value={rewardData.ganador}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>URL</label>
            <input
              type="text"
              name="url"
              value={rewardData.url}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Fecha válida</label>
            <input
              type="date"
              name="valido"
              value={rewardData.valido}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Actualizando...' : 'Actualizar premio'}
          </button>
        </form>
      )}
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default AdminEditReward;
