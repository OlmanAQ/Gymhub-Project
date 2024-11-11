import React, { useState, useEffect, useCallback } from 'react';
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { sendAlert, getClientsWithUpcomingPayments } from '../../cruds/Alert';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/AdminAlertView.css';
import '../../css/GeneralAlertConfig.css';

const AdminAlertView = ({ onShowGeneralAlertConfig }) => {
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reminderLoadingId, setReminderLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const paymentsPerPage = 5;
  const now = new Date();


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const fetchedPayments = await getClientsWithUpcomingPayments();
        // Get the most recent payment for each unique client
        const latestPayments = Object.values(fetchedPayments.reduce((acc, payment) => {
          if (!acc[payment.cliente] || new Date(payment.fechaVencimiento) > new Date(acc[payment.cliente].fechaVencimiento)) {
            const dueDate = new Date(payment.fechaVencimiento.split(',')[0]);
            console.log(dueDate);
            const differenceInDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
            console.log(differenceInDays);
            acc[payment.cliente] = payment;
          }
          return acc;
        }, {}));
        // Sort payments by those with the most days overdue or closest to due
        latestPayments.sort((a, b) => new Date(a.fechaVencimiento) - new Date(b.fechaVencimiento));
        setPayments(latestPayments);
      } catch (error) {
        Swal.fire('Error', 'No se pudo cargar la información.', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSendPaymentReminder = useCallback(async (payment) => {
    try {
      setReminderLoadingId(payment.id);
      const message = `Recordatorio: Su próximo pago es el ${payment.fechaVencimiento.split(',')[0]}.`;
      await sendAlert(message, payment.id, payment.uid, payment.correo);
      Swal.fire('Éxito', 'Recordatorio de pago enviado correctamente.', 'success');
    } catch (error) {
      Swal.fire('Error', 'No se pudo enviar el recordatorio de pago.', 'error');
    } finally {
      setReminderLoadingId(null);
    }
  }, []);

  
  const pageCount = Math.ceil(payments.length / paymentsPerPage);
  const offset = currentPage * paymentsPerPage;
  const currentPayments = payments.slice(offset, offset + paymentsPerPage);

  
  const handlePagination = (direction) => {
    if (direction === 'next' && currentPage < Math.floor(payments.length / paymentsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
    else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    else if (direction === 'first') {
      setCurrentPage(0);
    }
    else if (direction === 'last') {
      setCurrentPage(Math.floor(payments.length / paymentsPerPage));
    }

  };

  return (
    <div className="container mt-4 admin-alert-view">
      <h2 className="mb-4">Gestión de Alertas</h2>
      <button className="btn btn-secondary mb-4" onClick={onShowGeneralAlertConfig}>
        Configurar Alerta General
      </button>
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-dark">
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">Correo</th>
              <th scope="col">Fecha de Vencimiento</th>
              <th scope="col">Monto</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPayments.length > 0 ? (
              currentPayments.map((payment) => (
                <tr key={payment.uid}>
                  <td>{payment.cliente}</td>
                  <td>{payment.correo}</td>
                  <td>{payment.fechaVencimiento.split(',')[0]}</td>
                  <td>{payment.monto}</td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleSendPaymentReminder(payment)} 
                      disabled={isLoading || reminderLoadingId === payment.uid}
                    >
                      {reminderLoadingId === payment.uid ? 'Enviando...' : 'Enviar Alerta'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">No hay pagos próximos.</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="pagination-buttons">
          <button className='button-actions' onClick={() => handlePagination('first')} disabled={currentPage === 0}>
            <ChevronsLeft />
          </button>
          <button className='button-actions' onClick={() => handlePagination('prev')} disabled={currentPage === 0}>
            <ChevronLeft />
          </button>
          <span className="page-indicator">{currentPage + 1} de {pageCount}</span>
          <button className='button-actions' onClick={() => handlePagination('next')} disabled={currentPage === pageCount - 1}>
            <ChevronRight />
          </button>
          <button className='button-actions' onClick={() => handlePagination('last')} disabled={currentPage === pageCount - 1}>
            <ChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAlertView;
