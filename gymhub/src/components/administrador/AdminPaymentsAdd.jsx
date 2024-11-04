import React, { useState } from 'react';
import { agregarFactura } from '../../cruds/Create';
import { showAlert, AlertType } from '../../utils/Alert';
import logo from '../../assets/LogoGymHub.png';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toZonedTime } from 'date-fns-tz';
import '../../css/AdminPaymentsAdd.css';
const timeZone = 'America/Costa_Rica';

const formatFecha = (fecha) => {
  const zonedDate = toZonedTime(fecha, timeZone);
  return format(zonedDate, "d 'de' MMMM 'de' yyyy, h:mm:ss a 'UTC-6'", { locale: es });
};

const generarNumeroFactura = () => {
  const fecha = new Date();
  const year = fecha.getFullYear();
  const month = String(fecha.getMonth() + 1).padStart(2, '0');
  const day = String(fecha.getDate()).padStart(2, '0');
  const hours = String(fecha.getHours()).padStart(2, '0');
  const minutes = String(fecha.getMinutes()).padStart(2, '0');
  const seconds = String(fecha.getSeconds()).padStart(2, '0');
  return `GH-${year}${month}${day}-${hours}${minutes}${seconds}`;
};

const calcularFechaVencimiento = (motivo, tipoMembresia) => {
  const fechaActual = new Date();
  if (motivo === 'Pago de membresia') {
    switch (tipoMembresia) {
      case 'Dia': fechaActual.setDate(fechaActual.getDate() + 1); break;
      case 'Semana': fechaActual.setDate(fechaActual.getDate() + 7); break;
      case 'Mes': fechaActual.setMonth(fechaActual.getMonth() + 1); break;
      case 'Año': fechaActual.setFullYear(fechaActual.getFullYear() + 1); break;
      default: break;
    }
  } else {
    fechaActual.setMonth(fechaActual.getMonth() + 1);
  }
  return formatFecha(fechaActual);
};

const AdminPaymentsAdd = ({ selectedUser, onCancel }) => {
  const [formData, setFormData] = useState({
    cliente: selectedUser?.nombre || '',
    correo: selectedUser?.correo || '',
    fechaEmision: formatFecha(new Date()),
    fechaVencimiento: calcularFechaVencimiento('Pago de articulo', 'Mes'),
    motivo: 'Pago de articulo',
    tipoMembresia: '',
    monto: '',
    detalle: '',
    numeroFactura: generarNumeroFactura(),
    uid: selectedUser?.uid || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMotivoChange = (e) => {
    const newMotivo = e.target.value;
    let nuevaFechaVencimiento = '';

    if (newMotivo === 'Pago de articulo' || newMotivo === 'Otro') {
      nuevaFechaVencimiento = calcularFechaVencimiento(newMotivo, 'Mes');
    } else if (newMotivo === 'Pago de membresia') {
      nuevaFechaVencimiento = calcularFechaVencimiento(newMotivo, 'Mes');
    }

    setFormData({
      ...formData,
      motivo: newMotivo,
      tipoMembresia: newMotivo === 'Pago de membresia' ? 'Mes' : '',
      fechaVencimiento: nuevaFechaVencimiento,
    });
  };

  const handleTipoMembresiaChange = (e) => {
    const tipo = e.target.value;
    setFormData({
      ...formData,
      tipoMembresia: tipo,
      fechaVencimiento: calcularFechaVencimiento('Pago de membresia', tipo),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos obligatorios
    const { motivo, tipoMembresia, monto, detalle } = formData;
    if (!motivo || (motivo === 'Pago de membresia' && !tipoMembresia) || !monto || !detalle) {
      showAlert('Error', 'Todos los campos son obligatorios.', AlertType.ERROR);
      return;
    }

    try {
      await agregarFactura(formData);
      showAlert('Factura creada', 'La factura ha sido creada exitosamente.', AlertType.SUCCESS);
      onCancel(); // Regresa a AdminPaymentsView después de crear la factura
    } catch (error) {
      showAlert('Error', 'Hubo un problema al crear la factura.', AlertType.ERROR);
    }
  };

  return (
    <div className="admin-payments-add">
      <div className="header">
        <div className="logo">
          <img src={logo} alt="Gym Hub Logo" className="logo-image" />
          <div className="company-name">Gym Hub</div>
          <div className="client-info">
            <p className="invoice-number"><strong>Factura No:</strong> {formData.numeroFactura}</p>
            <p className="client-name"><strong>Cliente:</strong> {formData.cliente}</p>
            <p className="client-email"><strong>Correo:</strong> {formData.correo}</p>
          </div>
        </div>
        <div className="invoice-info">
          <div className="issue-date">
            <p><strong>Fecha de Emisión</strong></p>
            <p>{formData.fechaEmision}</p>
          </div>
          <div className="due-date">
            <p><strong>Fecha de Vencimiento</strong></p>
            <p>{formData.fechaVencimiento}</p>
          </div>
        </div>
      </div>
  
      <div className="separator"></div>
  
      <form className="form-section-container" onSubmit={handleSubmit}>
        <div className="form-section">
          <div className="form-section-item">
            <label className="label-motivo" htmlFor="motivo">Motivo</label>
            <select
              id="motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleMotivoChange}
              className="select-motivo"
            >
              <option value="Pago de articulo">Pago de artículo</option>
              <option value="Pago de membresia">Pago de membresía</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {formData.motivo === 'Pago de membresia' && (
            <div className="form-section-item-right">
              <label className="label-tipoMembresia" htmlFor="tipoMembresia">Tipo de Membresía</label>
              <select
                id="tipoMembresia"
                name="tipoMembresia"
                value={formData.tipoMembresia}
                onChange={handleTipoMembresiaChange}
                className="select-tipoMembresia"
              >
                <option value="Dia">Día</option>
                <option value="Semana">Semana</option>
                <option value="Mes">Mes</option>
                <option value="Año">Año</option>
              </select>
            </div>
          )}
        </div>

        <div className="form-section">
          <div className="form-section-item">
            <label className="label-monto" htmlFor="monto">Monto (₡)</label>
            <input
              id="monto"
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleInputChange}
              className="input-monto"
            />
          </div>
        </div>
        
        <div className="form-section">
          <div className="form-section-item">
            <label className="label-detalle" htmlFor="detalle">Detalle</label>
            <textarea
              id="detalle"
              name="detalle"
              value={formData.detalle}
              onChange={handleInputChange}
              className="textarea-detalle"
            />
          </div>
        </div>
        
        <div className="button-container">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-button"
          >
            Facturar
          </button>
        </div>
      </form>
    </div>
  );  
};

export default AdminPaymentsAdd;
