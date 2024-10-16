import React, { useState, useEffect } from 'react';
import { obtenerGastos, eliminarGasto } from '../../cruds/ExpenseCrud';
import { Edit, Trash, Plus, Info, Search, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import '../../css/AdminExpenseView.css';

const AdminExpenseView = ({ onShowRegisterExpense, onShowEditExpense }) => {
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const gastos = await obtenerGastos();
      setExpenses(gastos);
    };
    fetchExpenses();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.nombre && expense.nombre.toLowerCase().includes(searchTerm)
  );

  const displayedItems = filteredExpenses.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const handlePagination = (direction) => {
    if (direction === 'next' && currentPage < Math.floor(filteredExpenses.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
    else if (direction === 'first') {
      setCurrentPage(0);
    }
    else if (direction === 'last') {
      setCurrentPage(Math.floor(filteredExpenses.length / itemsPerPage));
    }

  };

  const deleteExpense = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
    if (result.isConfirmed) {
      await eliminarGasto(id);
      setExpenses(expenses.filter(expense => expense.id !== id));
      Swal.fire('Eliminado', 'El gasto ha sido eliminado.', 'success');
    }
  };

  return (
    <div className="admin-expense-view">
      <div className="expense-actions">
        <button className="add-expense-button" onClick={onShowRegisterExpense}>Agregar Gasto</button>
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>
      <div className="table-container">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Monto</th>
              <th>Categoría</th>
              <th>Fecha</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.length === 0 ? (
              <tr>
                <td colSpan="6">No se encontraron gastos</td>
              </tr>
            ) : (
              displayedItems.map(expense => (
                <tr key={expense.id}>
                  <td>{expense.nombre}</td>
                  <td>{expense.monto}</td>
                  <td>{expense.categoria}</td>
                  <td>{expense.fecha}</td>
                  <td>
                    <button className='button-actions' onClick={() => onShowEditExpense(expense.id)}>
                    <Edit size={16} color="#007BFF" />
                    </button>
                  </td>
                  <td>
                    <button className='button-actions' onClick={() => deleteExpense(expense.id)}>
                    <Trash size={16} color="#DC3545" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="pagination-buttons">
        <button className='button-actions' onClick={() => handlePagination('first')} disabled={currentPage === 0}>
        <ChevronsLeft />
        </button>
        <button className='button-actions' onClick={() => handlePagination('prev')} disabled={currentPage === 0}>
        <ChevronLeft />
        </button>
        <span className="page-indicator">{currentPage + 1} de {Math.floor(filteredExpenses.length / itemsPerPage) + 1}</span>
        <button className='button-actions' onClick={() => handlePagination('next')} disabled={currentPage === Math.floor(filteredExpenses.length / itemsPerPage)}>
        <ChevronRight  />
        </button>
        <button className='button-actions' onClick={() => handlePagination('last')} disabled={currentPage === Math.floor(filteredExpenses.length / itemsPerPage)}>
        <ChevronsRight  />
        </button>
      </div>
    </div>
  );
};

export default AdminExpenseView;