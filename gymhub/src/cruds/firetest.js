import { doc, setDoc, addDoc, collection} from 'firebase/firestore';
import { db } from '../firebaseConfig/firebase';

// Función para agregar un gimnasio con inventario
async function addGymAndInventory() {
    // Define el ID del gimnasio
    const gymId = "gym_central";
    
    // Crea el documento del gimnasio en Firestore
    await setDoc(doc(db, "gyms", gymId), {
      gym_name: "Gimnasio Central",
      location: "Avenida Central, 123, Ciudad",
      manager: "Juan Pérez",
      contact_info: {
        phone: "+1 234 567 890",
        email: "info@gymcentral.com"
      },
      opening_hours: {
        monday_to_friday: "6:00 AM - 10:00 PM",
        saturday: "8:00 AM - 6:00 PM",
        sunday: "Closed"
      }
    });
  
    // Ahora agrega equipos a la subcolección `inventory` de ese gimnasio
    const gymInventoryRef = collection(db, "gyms", gymId, "inventory");
  
    // Agrega un banco de pesas
    await setDoc(doc(gymInventoryRef, "bench_press"), {
      instrument_name: "Banco de pesas",
      category: "Pesas",
      description: "Banco ajustable para ejercicios de pecho y brazos",
      zones: ["Pecho", "Brazos", "Espalda"],
      quantity: 5,
      location: "Zona de pesas libres",
      maintenance_schedule: new Date('2024-09-07T10:00:00Z'),
      status: "Operativo",
      last_used: new Date('2024-09-06T14:30:00Z'),
      photo_url: "https://example.com/instrument_photo.jpg"
    });
  
    // Agrega una cinta de correr
    await setDoc(doc(gymInventoryRef, "treadmill"), {
      instrument_name: "Cinta de correr",
      category: "Cardio",
      description: "Máquina para correr",
      zones: ["Piernas", "Cardio"],
      quantity: 10,
      location: "Zona de cardio",
      maintenance_schedule: new Date('2024-08-30T09:00:00Z'),
      status: "En mantenimiento",
      last_used: new Date('2024-09-05T13:00:00Z'),
      photo_url: "https://example.com/cinta.jpg"
    });
    
    console.log("Gimnasio y su inventario agregados correctamente");
  }
  
  // Llama a la función para agregar el gimnasio y su inventario
  addGymAndInventory();
  