import React, { useState } from 'react';
import { agregarGasto } from '../../cruds/ExpenseCrud';
import Swal from 'sweetalert2';
import '../../css/AdminRegisterExpense.css';

const AdminRegisterExpense = ({ onClose }) => {
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
    
        return `${day}/${month}/${year}`;
      };

    const [form, setForm] = useState({
        nombre: '',
        monto: '',
        categoria: '',
        fecha: formatDate(new Date()),
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await agregarGasto(form);
            Swal.fire('Éxito', 'Gasto agregado correctamente', 'success');
            onClose();
        } catch (error) {
            console.error('Error adding expense: ', error);
            Swal.fire('Error', 'No se pudo agregar el gasto', 'error');
        }
    };

    return (
        <div className="admin-register-expense-view">
            <h2>Agregar Gasto</h2>
            <form className="expense-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Nombre del gasto"
                    className="form-control"
                />
                <input
                    type="number"
                    name="monto"
                    value={form.monto}
                    onChange={handleChange}
                    placeholder="Monto"
                    className="form-control"
                />
                <input
                    type="text"
                    name="categoria"
                    value={form.categoria}
                    onChange={handleChange}
                    placeholder="Categoría"
                    className="form-control"
                />
                <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    onChange={handleChange}
                    className="form-control"
                />
                <div className="form-buttons">
                    <button type="submit" className="btn-submit">Agregar Gasto</button>
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default AdminRegisterExpense;