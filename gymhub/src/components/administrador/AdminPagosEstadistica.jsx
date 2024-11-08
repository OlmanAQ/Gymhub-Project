import React, { useState } from 'react';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import '../../css/AdminGastosEstadistica.css';
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

const AdminPagosEstadistica = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Monto de ingresos por fecha (CRC)',
        data: [],
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  });
  const [startDate, setStartDate] = useState(''); 
  const [endDate, setEndDate] = useState(''); 
  const [tipoIngreso, setTipoIngreso] = useState('all'); 
  
  const handleTipoIngresoChange = (e) => {
    setTipoIngreso(e.target.value);
  };


const fetchIngresos = async () => {
  if (!startDate || !endDate) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
  }

  const startTimestamp = Timestamp.fromDate(new Date(startDate)); 
  const endTimestamp = Timestamp.fromDate(new Date(endDate + 'T23:59:59')); 

  console.log("Rango de fechas:", startTimestamp.toDate(), "a", endTimestamp.toDate());

  try {

      let ingresosQuery = query(
          collection(db, 'Payments'),
          where('createdAt', '>=', startTimestamp),
          where('createdAt', '<=', endTimestamp)
      );
      

      const querySnapshot = await getDocs(ingresosQuery);

      if (querySnapshot.empty) {
          console.log("No se encontraron ingresos en el rango de fechas especificado.");
          Swal.fire('Sin datos', 'No se encontraron ingresos en el rango de fechas especificado.', 'info');
          setChartData({ labels: [], datasets: [{ label: '', data: [] }] });
          return;
      }

    
      querySnapshot.docs.forEach(doc => {
          console.log("Documento encontrado:", doc.data());
          console.log("Fecha de createdAt:", doc.data().createdAt.toDate());
      });

      const ingresosList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          monto: parseFloat(doc.data().monto)
      }))
      .filter(doc => tipoIngreso === 'all' || doc.motivo === tipoIngreso); 

      processChartData(ingresosList);

  } catch (error) {
      console.error('Error al obtener los ingresos:', error);
      Swal.fire('Error', 'Hubo un problema al obtener los ingresos.', 'error');
  }
};


  const processChartData = (ingresosFiltrados) => {
    
    if (ingresosFiltrados.length === 0) {
      setChartData({ labels: [], datasets: [{ label: '', data: [] }] });
      return;
    }

    const fechas = [];
    const montos = [];

    ingresosFiltrados.forEach((ingreso) => {
      if (ingreso.createdAt) {
        const fecha = ingreso.createdAt.toDate().toLocaleDateString();
        fechas.push(fecha); 
        montos.push(ingreso.monto); 
      }
    });

    console.log("Fechas para el gráfico:", fechas);
    console.log("Montos para el gráfico:", montos);

    setChartData({
      labels: fechas,
      datasets: [
        {
          label: 'Monto de ingresos por fecha (CRC)',
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
      <h1 className='titulo'>Estadísticas de ingresos del gimnasio</h1>
  
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
          <label>Tipo de ingreso: </label>
          <select
            className='select-categories'
            value={tipoIngreso}
            onChange={handleTipoIngresoChange}
          >
            <option value="all">Ambos</option>
            <option value="Pago de articulo">Pago de artículo</option>
            <option value="Pago de membresia">Pago de membresía</option>
          </select>
        </div>
  
        <div className='btn-container'>
          <button className='cons-btn' onClick={fetchIngresos}>Consultar</button>
        </div>
      </div>

      <div class="graph-wrapper">
        <div className='graph-container'>
          {chartData.labels.length > 0 ? (
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
                    text: 'Ingresos del gimnasio por fecha',
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

export default AdminPagosEstadistica;
