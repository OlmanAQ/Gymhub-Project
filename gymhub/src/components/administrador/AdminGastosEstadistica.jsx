import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import '../../css/AdminGastosEstadistica.css'
import Swal from 'sweetalert2';
import { Line } from 'react-chartjs-2'; 
import { db } from '../../firebaseConfig/firebase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminGastosEstadistica = () => {
  const [gastos, setGastos] = useState([]);
  const [chartData, setChartData] = useState({});
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState(''); 
  const [categoria, setCategoria] = useState('general'); 
  
  
  const handleCategoriaChange = (e) => {
    setCategoria(e.target.value);
  };

  
  const fetchGastos = async () => {
    if (!startDate || !endDate) {
        Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    try {
      let gastosQuery = query(
        collection(db, 'gastos'),
        where('fecha', '>=', startDate),
        where('fecha', '<=', endDate)
      );

      const querySnapshot = await getDocs(gastosQuery);
      const gastosList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        monto: parseFloat(doc.data().monto) 
      }));

      
      const filteredGastos = categoria === 'general'
        ? gastosList
        : gastosList.filter(gasto => gasto.categoria === categoria);

      setGastos(filteredGastos);
      processChartData(filteredGastos);
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
    }
  };

  
  const processChartData = (gastosFiltrados) => {
    const fechas = []; 
    const montos = []; 

    gastosFiltrados.forEach((gasto) => {
      fechas.push(gasto.fecha); 
      montos.push(gasto.monto); 
    });

    setChartData({
      labels: fechas, 
      datasets: [
        {
          label: 'Monto de gastos por fecha (CRC)',
          data: montos, 
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)',
          tension: 0.1,
        },
      ],
    });
  };

  return (
    <div className='gts-container'>
      <h1 className='titulo'>Estadísticas de gastos del gimnasio</h1>
  
      <div className='form-data'>
        <div className='dates-container'>
          <label>Fecha de inicio: </label>
          <input
            className='date-input'
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
  
          <label>Fecha de fin: </label>
          <input
            className='date-input'
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
  
        <div className='categories-container'>
          <label>Categoría: </label>
          <select
            className='select-categories'
            value={categoria}
            onChange={handleCategoriaChange}
          >
            <option value="general">General</option>
            <option value="electricidad">Electricidad</option>
            <option value="agua">Agua</option>
            <option value="alquiler">Alquiler</option>
          </select>
        </div>
  
        <div className='btn-container'>
          <button className='cons-btn' onClick={fetchGastos}>Consultar</button>
        </div>
      </div>


      <div class="graph-wrapper">
        <div className='graph-container'>
          {chartData && chartData.labels ? (
            <Line
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false,
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Gastos del gimnasio por fecha',
                  },
                },
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: 'Fechas',
                    },
                  },
                  y: {
                    title: {
                      display: true,
                      text: 'Monto (Colones)',
                    },
                  },
                },
              }}
            />
          ) : (
            <p className='message'>No hay datos disponibles para mostrar.</p>
          )}
        </div>
      </div>

    </div>
  );
  
};

export default AdminGastosEstadistica;
