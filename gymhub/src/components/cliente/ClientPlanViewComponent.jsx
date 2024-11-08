import React, { useState, useEffect } from 'react';
import '../../css/TrainerSearchPlanComponent.css';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import {Info, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useSelector } from 'react-redux';


const obtenerPlanesUsuario = async (usuario) => {
  try {
    const q = query(collection(db, 'plans'), where('usuario', '==', usuario));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      estado: doc.data().estado || false, 
      fechaCreacion: doc.data().fechaCreacion || new Date().toISOString(), 
    }));
  } catch (error) {
    console.error('Error al obtener los planes: ', error);
    throw new Error('No se pudo obtener los planes.');
  }
};



function ClientPlanViewComponent() {
  const [plans, setPlans] = useState([]);
  const [error, setError] = useState('');
  const [showCreatePlan, setShowCreatePlan] = useState(false);
  const [showEditPlan, setShowEditPlan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const plansPerPage = 5;
  const usuarioExiste = useSelector((state) => state.user.username);

  useEffect(() => {
  
    document.body.style.backgroundImage = 'none';
    document.body.style.backgroundColor = '#f1f3f5';

    return () => {
      document.body.style.backgroundImage = ''; 
      document.body.style.backgroundColor = ''; 
    };
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(plans.length / plansPerPage));
  }, [plans]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const planesUsuario = await obtenerPlanesUsuario(usuarioExiste);
        setPlans(planesUsuario);
      } catch (error) {
        console.error('Error al obtener los planes: ', error);
        setError('No se pudo obtener los planes.');
      }
    };

    fetchPlans();
  }, [usuarioExiste]);

  const handleShowPlanInfo = (plan) => {
    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  
    const rutinaHtml = `
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #71b112; color: #fff">
            <th style="border: 1.3px solid #ddd; padding: 8px;">Día</th>
            <th style="border: 1.3px solid #ddd; padding: 8px;">Ejercicio</th>
            <th style="border: 1.3px solid #ddd; padding: 8px;">Repeticiones</th>
            <th style="border: 1.3px solid #ddd; padding: 8px;">Series</th>
          </tr>
        </thead>
        <tbody>
          ${diasSemana.map(dia => `
            <tr>
              <td style="border: 1.3px solid #ddd; padding: 8px;">${dia}</td>
              <td style="border: 1.3px solid #ddd; padding: 8px;">
                ${plan.rutina[dia] ? plan.rutina[dia].map(ejercicio => `
                  <div>${Object.keys(ejercicio)[0]}</div>
                `).join('') : 'Sin ejercicio'}
              </td>
              <td style="border: 1.3px solid #ddd; padding: 8px;">
                ${plan.rutina[dia] ? plan.rutina[dia].map(ejercicio => `
                  <div>${ejercicio[Object.keys(ejercicio)[0]].Repeticiones || 'N/A'}</div>
                `).join('') : 'N/A'}
              </td>
              <td style="border: 1.3px solid #ddd; padding: 8px;">
                ${plan.rutina[dia] ? plan.rutina[dia].map(ejercicio => `
                  <div>${ejercicio[Object.keys(ejercicio)[0]].Series || 'N/A'}</div>
                `).join('') : 'N/A'}
              </td>
            </tr>
          `).join('')}
        </tbody>
        <tfoot>
          <tr style="background-color: #f1f1f1;">
            <td style="border: 1.3px solid #ddd; padding: 8px;" colspan="4">
              <strong>Estado:</strong> ${plan.estado ? 'Activa' : 'Inactiva'} <br>
              <strong>Fecha de creación:</strong> ${new Date(plan.fechaCreacion).toLocaleDateString()}
            </td>
          </tr>
        </tfoot>
      </table>
    `;
  
    Swal.fire({
      title: 'Información de la rutina',
      html: rutinaHtml,
      confirmButtonText: 'Cerrar',
      width: '90%',
      padding: '2em',
      background: '#fff',
      customClass: {
        container: 'swal2-container',
        title: 'swal2-title',
        content: 'swal2-content',
        confirmButton: 'swal2-confirm'
      }
    });
  };
  

  const handleBackToSearch = () => {
    setShowCreatePlan(false);
    setShowEditPlan(null); 
  };


  const indexOfLastPlan = currentPage * plansPerPage;
  const indexOfFirstPlan = indexOfLastPlan - plansPerPage;
  const currentPlans = plans.slice(indexOfFirstPlan, indexOfLastPlan);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="contenedor-princ">
      {!showCreatePlan && !showEditPlan ? (
        <>
          <h1 className="title">Planes de entrenamiento</h1>
          
          {error && <p className="error-message">{error}</p>}

          {plans.length > 0 && (
        <div className="table-cont">
          <table className="table-pln">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre de rutina</th>
                <th>Estado</th>
                <th>Fecha de creación</th>
                <th>Ver rutina</th>
              </tr>
            </thead>
            <tbody>
              {currentPlans.map(plan => (
                <tr key={plan.id}>
                  <td>{plan.usuario}</td>
                  <td>{plan.nombre || 'Rutina sin nombre'}</td>
                  <td>{plan.estado ? 'Activa' : 'Inactiva'}</td>
                  <td>{new Date(plan.fechaCreacion).toLocaleDateString()}</td>
                  <td>
                    <button className='aux-button' onClick={() => handleShowPlanInfo(plan)}>
                      <Info size={28} color="#007BFF" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="pgn-control">
            <button className='pagination-btn' onClick={() => paginate(1)} disabled={currentPage === 1}>
              <ChevronsLeft size={20} />
            </button>
            <button className='pagination-btn' onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              <ChevronLeft size={20} />
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button className='pagination-btn' onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              <ChevronRight size={20} />
            </button>
            <button className='pagination-btn' onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
      )}
      
        </>
      ) : showCreatePlan ? (
        <>
          <button className='button-back' onClick={handleBackToSearch}>Volver a la búsqueda</button>
        </>
      ) : (
        <>
          <button className='button-back' onClick={handleBackToSearch}>Volver a la búsqueda</button>
        </>
      )}
    </div>
  );
}

export default ClientPlanViewComponent;
