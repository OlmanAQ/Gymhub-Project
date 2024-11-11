import React, { useState, useEffect } from 'react';
import { actualizarGasto, obtenerGastoPorId } from '../../cruds/ExpenseCrud';
import Swal from 'sweetalert2';
import '../../css/AdminEditExpense.css';

const AdminEditExpense = ({ gastoId, onClose }) => {
    const [form, setForm] = useState({
        nombre: '',
        monto: '',
        categoria: '',
        fecha: '',
    });

    useEffect(() => {
        const fetchGasto = async () => {
            try {
                const gasto = await obtenerGastoPorId(gastoId);
                setForm(gasto);
            } catch (error) {
                console.error('Error fetching expense: ', error);
            }
        };
        fetchGasto();
    }, [gastoId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actualizarGasto(gastoId, form);
            Swal.fire('Éxito', 'Gasto actualizado correctamente', 'success');
            onClose();
        } catch (error) {
            console.error('Error updating expense: ', error);
            Swal.fire('Error', 'No se pudo actualizar el gasto', 'error');
        }
    };

    return (
        <div className="admin-expense-view">
            <h2>Editar Gasto</h2>
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
                    <button type="submit" className="btn-submit">Actualizar Gasto</button>
                    <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditExpense;