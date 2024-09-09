import { doc, setDoc, addDoc, collection} from 'firebase/firestore';
import { db, auth } from '../firebaseConfig/firebase';


export const agregarClienteConRol = async (cliente) => {
    try {
      // uid del usuario actual
      const { uid } = auth.currentUser;
      //elimnar contraseña de cliente
      delete cliente.contrasena;
      
      const clienteConRol = {
        ...cliente,
        rol: 'cliente',
        uid: uid
      };
      await addDoc(collection(db, 'User'), clienteConRol);
      console.log('Cliente agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar el cliente: ', error);
    }
};

export const agregarUsuario = async (usuario) => {
  try {
    await addDoc(collection(db, 'User'), usuario);
    console.log('Usuario agregado exitosamente');
  } catch (error) {
    console.error('Error al agregar el usuario: ', error);
  }
};



// Función para agregar un gimnasio con inventario y tipos de ejercicios
async function agregarGimnasioConInventarioYTiposEjercicios() {
  // Define el ID del gimnasio
  const gimnasioId = "gimnasio_central";
  
  // Crea el documento del gimnasio en Firestore
  await setDoc(doc(db, "gimnasios", gimnasioId), {
    nombre_gimnasio: "Gimnasio Central",
    ubicacion: "Avenida Central, 123, Ciudad",
    encargado: "Juan Pérez",
    info_contacto: {
      telefono: "+1 234 567 890",
      correo: "info@gimnasiocentral.com"
    },
    horario_apertura: {
      lunes_a_viernes: "6:00 AM - 10:00 PM",
      sabado: "8:00 AM - 6:00 PM",
      domingo: "Cerrado"
    }
  });

  // Ahora agrega equipos a la subcolección `inventario` de ese gimnasio
  const referenciaInventario = collection(db, "gimnasios", gimnasioId, "inventario");

  // Agrega un banco de pesas con ejercicios
  await setDoc(doc(referenciaInventario, "banco_pesas"), {
    nombre_instrumento: "Banco de pesas",
    categoria: "Pesas",
    descripcion: "Banco ajustable para ejercicios de pecho y brazos",
    zonas: ["Pecho", "Brazos", "Espalda"],
    cantidad: 5,
    ubicacion: "Zona de pesas libres",
    programa_mantenimiento: new Date('2024-09-07T10:00:00Z'),
    estado: "Operativo",
    ultimo_uso: new Date('2024-09-06T14:30:00Z'),
    url_foto: "https://example.com/instrument_photo.jpg",
    tipos_ejercicio: [
      {
        nombre: "Press de banca",
        descripcion: "Ejercicio para trabajar los músculos del pecho y tríceps",
        zonas: ["Pecho", "Tríceps"]
      },
      {
        nombre: "Press de hombros",
        descripcion: "Ejercicio para trabajar los músculos del hombro",
        zonas: ["Hombros"]
      }
    ]
  });

  // Agrega una cinta de correr con ejercicios
  await setDoc(doc(referenciaInventario, "cinta_correr"), {
    nombre_instrumento: "Cinta de correr",
    categoria: "Cardio",
    descripcion: "Máquina para correr",
    zonas: ["Piernas", "Cardio"],
    cantidad: 10,
    ubicacion: "Zona de cardio",
    programa_mantenimiento: new Date('2024-08-30T09:00:00Z'),
    estado: "En mantenimiento",
    ultimo_uso: new Date('2024-09-05T13:00:00Z'),
    url_foto: "https://example.com/cinta.jpg",
    tipos_ejercicio: [
      {
        nombre: "Carrera a velocidad",
        descripcion: "Ejercicio de cardio para mejorar la resistencia cardiovascular",
        zonas: ["Piernas", "Cardio"]
      },
      {
        nombre: "Carrera de intervalos",
        descripcion: "Ejercicio de alta intensidad alternando periodos de carrera rápida y lenta",
        zonas: ["Piernas", "Cardio"]
      }
    ]
  });

  console.log("Gimnasio y su inventario con ejercicios agregados correctamente");
}


export const agregarGimnasio = async (gimnasio) => {
  try {
    await addDoc(collection(db, 'gimnasios'), gimnasio);
    console.log('Gimnasio agregado exitosamente');
  } catch (error) {
    console.error('Error al agregar el gimnasio: ', error);
  }
};




