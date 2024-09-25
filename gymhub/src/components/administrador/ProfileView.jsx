import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { Eye, EyeOff, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { actualizarUsuario } from '../../cruds/Update';
import { obtenerInfoUsuarioCorreo } from '../../cruds/Read';
import '../../css/AdminUpdateUser.css';

const ProfileView = (onClose) => {
    const usuario = useSelector((state) => state.user);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (usuario.isAuthenticated) {
            obtenerInfoUsuarioCorreo(usuario.correo).then((usuario) => {
                setUser(usuario);
            });
        }
    }, [usuario]);
    

    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        correo: '',
        contrasena: '',
        edad: '',
        estatura: '',
        peso: '',
        genero: '',
        padecimientos: '',
        telefono: '',
        tipoMembresia: '',
        renovacion: '', // Usar formato dd/mm/yyyy para el input de tipo text
        rol: '',
        fechaInscripcion: '' // Añadido para mostrar la fecha de inscripción
    });

    const [showPassword, setShowPassword] = useState(false); // Estado para controlar la visibilidad de la contraseña
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        if (user) {
            setFormData({
                ...user,
                renovacion: user.renovacion ? convertToDisplayDateFormat(user.renovacion) : '', // Convertir fecha si existe, si no, establecer como cadena vacía
                tipoMembresia: user.tipoMembresia || '', // Asegurarse de que el tipo de membresía esté correctamente establecido
                fechaInscripcion: user.fechaInscripcion || '' // Convertir fecha de inscripción si existe
            });
        }
    }, [user]);

    const handleClose = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Los cambios no guardados se perderán.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                onClose(); // Llama a la función de cierre solo si el usuario confirma
            }
        });
    };

    // Convertir fecha de DD/MM/YYYY a YYYY-MM-DD
    const convertToManipulationDateFormat = (dateStr) => {
        const [day, month, year] = dateStr.split('/').map(Number);
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    // Convertir fecha de YYYY-MM-DD a DD/MM/YYYY
    const convertToDisplayDateFormat = (dateStr) => {
        if (!dateStr) return ''; // Si no hay fecha, retornar cadena vacía
        const [year, month, day] = dateStr.split('-').map(Number);

        // Verificar si la fecha es válida
        if (!year || !month || !day) return ''; // Si alguna parte de la fecha es inválida, retornar cadena vacía

        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    };

    const updateRenovacionDate = (membresiaType) => {
        if (membresiaType === 'Seleccione') {
            // Si "Seleccione" es la opción elegida, no modificar la fecha de renovación
            return;
        }

        if (!user?.renovacion) return;

        const baseDate = new Date(convertToManipulationDateFormat(user.renovacion));
        let newDate = new Date(baseDate);

        switch (membresiaType) {
            case 'Día':
                newDate.setDate(baseDate.getDate() + 1);
                break;
            case 'Semana':
                newDate.setDate(baseDate.getDate() + 7);
                break;
            case 'Mes':
                newDate.setMonth(baseDate.getMonth() + 1);
                break;
            case 'Año':
                newDate.setFullYear(baseDate.getFullYear() + 1);
                break;
            default:
                return;
        }

        setFormData({
            ...formData,
            tipoMembresia: membresiaType,
            renovacion: convertToDisplayDateFormat(newDate.toISOString().split('T')[0])
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validateForm = () => {
        const {
            nombre, usuario, correo, contrasena, edad, estatura, peso, genero, padecimientos, telefono, tipoMembresia, rol, renovacion, fechaInscripcion
        } = formData;

        console.log('Datos del formulario:', formData);

        // Verificar que los campos no estén vacíos y que los selects no tengan la opción por defecto "Seleccione"
        if (!nombre || !usuario || !correo || !contrasena || !edad || !estatura || !peso || !genero || !padecimientos || !telefono || !renovacion || !fechaInscripcion || tipoMembresia === '' || rol === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Por favor, completa todos los campos requeridos y selecciona opciones válidas.',
                confirmButtonText: 'OK'
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Asegurarse de que fechaInscripcion esté incluida en formData
        if (!formData.fechaInscripcion && user?.fechaInscripcion) {
            setFormData({
                ...formData,
                fechaInscripcion: user.fechaInscripcion
            });
        }

        if (!validateForm()) {
            return; // Si la validación falla, no continuar con la actualización
        }

        try {
            console.log('Datos para actualizar:', formData);

            // Actualizar el usuario en Firestore
            await actualizarUsuario(user.id, formData);

            Swal.fire({
                icon: 'success',
                title: 'Usuario actualizado',
                text: 'Los datos del usuario han sido actualizados exitosamente.',
                confirmButtonText: 'OK'
            });
            onClose(); // Cierra el formulario de edición
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo actualizar la información del usuario.',
                confirmButtonText: 'Entendido'
            });
            console.error('Error al actualizar el usuario:', error);
        }
    };



    return (
        <>
            <div className="register-user-header">
                <h2>Editar Usuario</h2>
            </div>
            <div className="admin-update-user">
                <button className="close-button-admin-update-user" onClick={handleClose}>
                    <X size={24} />
                </button>
                <form onSubmit={handleSubmit}>
                    <label>
                        Nombre actual: {user?.nombre}
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nuevo nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Usuario actual: {user?.usuario}
                        <input
                            type="text"
                            name="usuario"
                            placeholder="Nuevo usuario"
                            value={formData.usuario}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Correo actual: {user?.correo}
                        <input
                            type="email"
                            name="correo"
                            placeholder="Nuevo correo"
                            value={formData.correo}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Contraseña:
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="contrasena"
                                placeholder="Nueva contraseña"
                                value={formData.contrasena}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                className="password-toggle-btn"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                            </button>
                        </div>
                    </label>
                    <label>
                        Edad actual: {user?.edad}
                        <input
                            type="number"
                            name="edad"
                            placeholder="Nueva edad"
                            value={formData.edad}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Estatura actual: {user?.estatura}
                        <input
                            type="number"
                            name="estatura"
                            placeholder="Nueva estatura"
                            step="0.01"
                            value={formData.estatura}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Peso actual: {user?.peso}
                        <input
                            type="number"
                            name="peso"
                            placeholder="Nuevo peso"
                            step="0.01"
                            value={formData.peso}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Género actual: {user?.genero}
                        <select
                            name="genero"
                            value={formData.genero}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione</option>
                            <option value="Masculino">Hombre</option>
                            <option value="Femenino">Mujer</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </label>
                    <label>
                        Padecimientos actuales: {user?.padecimientos}
                        <textarea
                            name="padecimientos"
                            placeholder="Nuevos padecimientos"
                            value={formData.padecimientos}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Teléfono actual: {user?.telefono}
                        <input
                            type="text"
                            name="telefono"
                            placeholder="Nuevo teléfono"
                            value={formData.telefono}
                            onChange={handleChange}
                        />
                    </label>
                    <label>
                        Tipo de membresía: { user?.tipoMembresia}
                        <select
                            name="tipoMembresia"
                            value={formData.tipoMembresia}
                            onChange={(e) => {
                                handleChange(e);
                                updateRenovacionDate(e.target.value);
                            }}
                        >
                            <option value="">Seleccione</option>
                            <option value="Día">Dia</option>
                            <option value="Semana">Semana</option>
                            <option value="Mes">Mes</option>
                            <option value="Año">Año</option>
                        </select>
                    </label>
                    <label>
                        Fecha de renovación:{user?.renovacion}
                        <input
                            type="text"
                            name="renovacion"
                            value={formData.renovacion}
                            readOnly
                        />
                    </label>
                    <label>
                        Rol actual: {user?.rol}
                        <select
                            name="rol"
                            value={formData.rol}
                            onChange={handleChange}
                        >
                            <option value="">Seleccione</option>
                            <option value="Cliente">Cliente</option>
                            <option value="Entrenador">Entrenador</option>
                            <option value="Administrador">Administrador</option>
                        </select>
                    </label>
                    <label>
                        Fecha de inscripción:{ user?.fechaInscripcion}
                        <input
                            type="text"
                            value={formData.fechaInscripcion || user?.fechaInscripcion}
                            readOnly
                        />
                    </label>
                    <button type="submit">Actualizar</button>
                </form>
            </div>
        </>
    );
};

export default ProfileView;
