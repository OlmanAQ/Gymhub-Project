import { collection, query, where, getDocs, getDoc, doc, orderBy } from 'firebase/firestore';

import { db } from '../firebaseConfig/firebase';

export const verificarCorreoExistente = async (correo) => {
  try {
    const q = query(collection(db, 'User'), where('correo', '==', correo));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error al verificar el correo: ', error);
    throw new Error('No se pudo verificar el correo.');
  }
};

export const verificarUsuario = async (usuario) => {
    try {
      const q = query(collection(db, 'User'), where('usuario', '==', usuario));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error al verificar el usuario: ', error);
      throw new Error('No se pudo verificar el usuario.');
    }
};

export const obtenerTodosLosUsuarios = async (sortOption) => {
  try {
    const q = query(collection(db, 'User'));
    const querySnapshot = await getDocs(q);
    const usuarios = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const parseFecha = (fechaStr) => {
      const [day, month, year] = fechaStr.split('/').map(Number);
      return new Date(year, month - 1, day);
    };
    const fechaActual = new Date();
    fechaActual.setHours(0, 0, 0, 0);
    if (sortOption === 'Nombre completo (A-Z)') {
      usuarios.sort((a, b) => a.nombre.localeCompare(b.nombre));
    } else if (sortOption === 'Usuario (A-Z)') {
      usuarios.sort((a, b) => a.usuario.localeCompare(b.usuario));
    } else if (sortOption === 'Recientes') {
      usuarios.sort((a, b) => {
        const fechaInscripcionA = parseFecha(a.fechaInscripcion);
        const fechaInscripcionB = parseFecha(b.fechaInscripcion);
        fechaInscripcionA.setHours(0, 0, 0, 0);
        fechaInscripcionB.setHours(0, 0, 0, 0);
        const diffA = Math.abs(fechaActual - fechaInscripcionA);
        const diffB = Math.abs(fechaActual - fechaInscripcionB);
        return diffA - diffB;
      });
    } else if (sortOption === 'Rol') {
      const rolesOrder = { 'administrador': 1, 'entrenador': 2, 'cliente': 3 };
      usuarios.sort((a, b) => rolesOrder[a.rol] - rolesOrder[b.rol]);
    } else if (sortOption === 'Tipo de membresía') {
      const membresiasOrder = { 'Dia': 1, 'Semana': 2, 'Mes': 3, 'Año': 4 };
      usuarios.sort((a, b) => membresiasOrder[a.tipoMembresia] - membresiasOrder[b.tipoMembresia]);
    }

    return usuarios;
  } catch (error) {
    console.error('Error al obtener los usuarios: ', error);
    throw new Error('No se pudo obtener la lista de usuarios.');
  }
};

export const obtenerInfoUsuario = async (correo, usuario) => {
  try {
    const q = query(
      collection(db, 'User'),
      where('correo', '==', correo),
      where('usuario', '==', usuario)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const usuarioDoc = querySnapshot.docs[0];
      return { id: usuarioDoc.id, ...usuarioDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el usuario: ', error);
    throw new Error('No se pudo obtener la información del usuario.');
  }
};

export const obtenerInfoUsuarioCorreo = async (correo) => {
  try {
    const q = query(
      collection(db, 'User'),
      where('correo', '==', correo),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const usuarioDoc = querySnapshot.docs[0];
      return { id: usuarioDoc.id, ...usuarioDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error al obtener el usuario: ', error);
    throw new Error('No se pudo obtener la información del usuario.');
  }
};

export const obtenerTodosLosProductos = async (filter) => {
  const productosRef = collection(db, 'Sales');
  
  let productosQuery;
  if (filter === "Precio mayor") {
    productosQuery = query(productosRef, orderBy("price", "desc"));
  } else if (filter === "Precio menor") {
    productosQuery = query(productosRef, orderBy("price", "asc"));
  } else {
    productosQuery = productosRef;
  }

  const productosSnapshot = await getDocs(productosQuery);
  
  return productosSnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      price: parseFloat(data.price) // Convertimos el price de cadena a número
    };
  });
};

export const obtenerProducto = async (productId, filter) => {
  const docRef = doc(db, 'Sales', productId);
  const productoDoc = await getDoc(docRef);
  if (productoDoc.exists()) {
    return productoDoc.data();
  } else {
    throw new Error('Producto no encontrado');
  }
};

export const obtenerCarritoCompras = async (usuarioId) => {
  try {
    const carritoRef = collection(db, 'ShopingCar');
    const q = query(carritoRef, where('idUser', '==', usuarioId));
    const querySnapshot = await getDocs(q);

    const carrito = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return carrito;
  } catch (error) {
    console.error('Error al obtener el carrito de compras: ', error);
    throw new Error('No se pudo obtener el carrito de compras.');
  }
};
