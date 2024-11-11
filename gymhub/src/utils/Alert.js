import Swal from 'sweetalert2';

export const AlertType = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  QUESTION: 'question',
});

// Función genérica para mostrar alertas
export const showAlert = (title, text, type) => {
  Swal.fire({
    title,
    text,
    icon: type,
    confirmButtonText: 'OK'
  });
};

// Función para mostrar una alerta de éxito
export const showSuccessAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: AlertType.SUCCESS,
    confirmButtonText: 'OK',
    confirmButtonColor: '#28a745', // Color verde para éxito
  });
};

// Función para mostrar una alerta de error
export const showErrorAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: AlertType.ERROR,
    confirmButtonText: 'OK',
    confirmButtonColor: '#d33', // Color rojo para error
  });
};

// Función para mostrar una alerta de información
export const showInfoAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: AlertType.INFO,
    confirmButtonText: 'OK',
    confirmButtonColor: '#3085d6', // Color azul para información
  });
};

// Función para alertas con confirmación
export const showConfirmAlert = (title, text, confirmText, cancelText) => {
  return Swal.fire({
    title,
    text,
    icon: AlertType.QUESTION,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

// Función auxiliar para crear filas de la tabla
const createRow = (label, value, customStyle = '') => {
  return `
    <tr>
      <td style="width: 160px; text-align: right; padding-right: 10px; ${customStyle}"><strong>${label}</strong></td>
      <td style="text-align: left; word-wrap: break-word; white-space: normal;">${value || 'N/A'}</td>
    </tr>
  `;
};

// Función para mostrar la información del usuario en una alerta personalizada
export const showUserInfoAlert = (userInfo) => {
  Swal.fire({
    title: 'Información del Usuario',
    icon: AlertType.INFO,
    html: `
      <div style="display: flex; flex-direction: row; gap: 40px; justify-content: space-between; flex-wrap: nowrap;">
        <div style="flex: 1; right: 0;">
          <table style="width: 100%; table-layout: auto;">
            ${createRow('Nombre', userInfo.nombre)}
            ${createRow('Usuario', userInfo.usuario)}
            ${createRow('Edad', userInfo.edad)}
            ${createRow('Correo', userInfo.correo)}
            ${createRow('Rol', userInfo.rol)}
          </table>
        </div>
        <div style="flex: 1;">
          <table style="width: 100%; table-layout: auto;">
            ${createRow('Estatura', userInfo.estatura ? userInfo.estatura + ' m' : 'N/A')}
            ${createRow('Peso', userInfo.peso ? userInfo.peso + ' kg' : 'N/A')}
            ${createRow('Teléfono', userInfo.telefono)}
            ${createRow('Género', userInfo.genero)}
            ${createRow('Padecimientos', userInfo.padecimientos, 'vertical-align: top;')}
          </table>
        </div>
      </div>
    `,
    width: '950px',
    padding: '20px',
    confirmButtonText: 'Cerrar',
    customClass: {
      container: 'custom-swal-container',
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      htmlContainer: 'custom-swal-html-container',
      confirmButton: 'custom-swal-confirm-button',
    },
  });
};
