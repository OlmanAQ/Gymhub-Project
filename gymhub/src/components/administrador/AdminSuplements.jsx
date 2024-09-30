import React, { useState, useEffect } from 'react';
import { doc, getDoc, deleteField, updateDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import { Edit, Trash } from 'lucide-react';
import '../../css/AdminSuplements.css';

const AdminSuplemenstComp = ({onShowAddSuplements}) => {
  const [suplementos, setSuplementos] = useState([]);
  
  // Obtener los suplementos de la base de datos
  const fetchSuplementos = async () => {
    try {
      const docRef = doc(db, 'suplementslist', 'FkhKVhtSuwkyiSl7VvN9'); // Ajusta 'documentoID' según corresponda
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const suplementosData = docSnap.data();
        const suplementosList = Object.keys(suplementosData).map((key) => ({
          id: key, // nombre del suplemento
          ...suplementosData[key],
        }));
        setSuplementos(suplementosList);
        console.log(suplementosList)
      } else {
        console.log('No se encontró el documento.');
      }
    } catch (error) {
      console.error('Error al obtener los suplementos: ', error);
    }
  };

  // Función para eliminar un suplemento
  const handleDelete = async (id) => {
    // Mostrar alerta de confirmación con SweetAlert
    Swal.fire({
      title: '¿Eliminar suplemento?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Referencia al documento que contiene los suplementos
          const docRef = doc(db, 'suplementslist', 'FkhKVhtSuwkyiSl7VvN9'); // Ajusta con el ID real del documento
          
          // Eliminar el campo con el ID proporcionado (suplemento específico)
          await updateDoc(docRef, {
            [id]: deleteField(),
          });
  
          // Actualizar estado local para reflejar eliminación en la UI
          setSuplementos(suplementos.filter(suplemento => suplemento.id !== id));
  
          // Mostrar notificación de éxito
          Swal.fire('Eliminado', 'El suplemento ha sido eliminado.', 'success');
        } catch (error) {
          console.error('Error al eliminar el suplemento: ', error);
          Swal.fire('Error', 'Hubo un error al eliminar el suplemento.', 'error');
        }
      }
    });
  };
  

  useEffect(() => {
    fetchSuplementos();
  }, []);

  return (
    <div className="cont-principal">

        <div> 
          <h1 className="titulo">Suplementos</h1>
        </div>

        <div className='container-buttons'>
          <button className="button-gback"> Volver </button>
          <button className="button-create" onClick={onShowAddSuplements}> Agregar suplemento </button>
        </div>

        <div className="suplementos-container">
        {suplementos.length > 0 ? (
        suplementos.map((suplemento) => (
            <div key={suplemento.id} className="suplemento-card">
                <img src={suplemento.url} alt={suplemento.id} className="suplemento-img" />
                <h2>{suplemento.id}</h2>
                <p>Precio: ₡{suplemento.precio}</p>
                <p>Cantidad: {suplemento.cantidad}</p>
                <p>Estado: {suplemento.disponible ? 'Disponible' : 'No disponible'}</p>
                <p>Descripción: {suplemento.descripcion || 'Sin descripción disponible'}</p>
                <button className="button-sec" onClick={() => handleDelete(suplemento.id)}>
                    <Trash size={28} color="#FF5C5C" />
                    Eliminar
                </button>
                <button className="button-sec">
                    <Edit size={28} color="#F7E07F" />
                    Editar
                </button>
            </div>
        ))
        ) : (
        <p>No hay suplementos disponibles.</p>
        )}

        </div>


    </div>
  );
};

export default AdminSuplemenstComp;
