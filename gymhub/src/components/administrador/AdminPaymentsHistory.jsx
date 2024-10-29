import React, { useEffect, useState } from 'react';
import { obtenerFacturasPorUsuario } from '../../cruds/Read';
import { X } from 'lucide-react';
import logo from '../../assets/LogoGymHub.png';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../css/AdminPaymentsHistory.css';

const AdminPaymentsHistory = ({ selectedUser, onCancel }) => {
  const [facturas, setFacturas] = useState([]);
  const [selectedFactura, setSelectedFactura] = useState(null);

  const formatFecha = (fecha) => {
    return format(fecha, "d 'de' MMMM 'de' yyyy, h:mm:ss a 'UTC-6'", { locale: es });
  };

  useEffect(() => {
    const fetchFacturas = async () => {
      try {
        const facturasUsuario = await obtenerFacturasPorUsuario(selectedUser.uid);
        setFacturas(facturasUsuario || []);
        
        if (facturasUsuario && facturasUsuario.length > 0) {
          setSelectedFactura(facturasUsuario[0]);
        }
      } catch (error) {
        console.error('Error al obtener el historial de facturas:', error);
        setFacturas([]);
      }
    };

    if (selectedUser) {
      fetchFacturas();
    }
  }, [selectedUser]);

  const handleFacturaClick = (factura) => {
    setSelectedFactura(factura);
  };

  return (
    <div className="admin-payments-history-container">
      <X className="close-icon" onClick={onCancel} />
      <h2>Historial de Facturas para {selectedUser?.nombre}</h2>
      <div className="history-content">
        <ul className="facturas-list">
          {Array.isArray(facturas) && facturas.map(factura => (
            <li
              key={factura.numeroFactura}
              onClick={() => handleFacturaClick(factura)}
              className={selectedFactura?.numeroFactura === factura.numeroFactura ? 'selected' : ''}
            >
              <span>Fecha de creación: {formatFecha(factura.createdAt.toDate())}</span>
              <span className="factura-id">Factura No: {factura.numeroFactura}</span>
            </li>
          ))}
        </ul>

        {selectedFactura && (
          <div className="factura-details">
            <div className="factura-header">
              <div className="header-left">
                <img src={logo} alt="Gym Hub Logo" className="logo-image" />
                <p className="company-name">Gym Hub</p>
                <p><strong>Factura No:</strong><br /> {selectedFactura.numeroFactura}</p>
                <p><strong>Cliente:</strong><br /> {selectedFactura.cliente}</p>
                <p><strong>Correo:</strong><br /> {selectedFactura.correo}</p>
              </div>
              <div className="header-right">
                <p><strong>Fecha de Emisión:</strong><br /> {selectedFactura.fechaEmision}</p>
                <p><strong>Fecha de Vencimiento:</strong><br /> {selectedFactura.fechaVencimiento}</p>
              </div>
            </div>

            <hr className="divider" />

            <div className="factura-body">
              <div className="body-left">
                <p><strong>Motivo:</strong> {selectedFactura.motivo}</p>
                <p><strong>Monto:</strong> ₡{selectedFactura.monto}</p>
                <p><strong>Detalle:</strong> {selectedFactura.detalle}</p>
              </div>
              {selectedFactura.motivo === 'Pago de membresia' && (
                <div className="body-right">
                  <p><strong>Tipo de Membresía:</strong> {selectedFactura.tipoMembresia}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentsHistory;
