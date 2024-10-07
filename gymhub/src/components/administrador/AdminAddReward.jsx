import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import '../../css/AdminAddReward.css';

const AdminAddReward = ({ onClose }) => {
  const [tipoPremio, setTipoPremio] = useState('articulo');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('sin reclamar');
  const [ganador, setGanador] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const storage = getStorage();
  const [searchGanador, setSearchGanador] = useState('');
  const [ganadores, setGanadores] = useState([]);
  const [ganadorSeleccionado, setGanadorSeleccionado] = useState(null);




//------------------------------------------------------------------------------------------
  const handleSearchArticulo = async () => {
    const q = query(collection(db, 'Sales'), where('state', '==', 'Disponible'));
    const querySnapshot = await getDocs(q);
    const results = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.name.toLowerCase().includes(searchTerm.toLowerCase()) && data.quantity >= 1) {
        results.push(data);
      }
    });

    setItems(results);
  };


  const handleSearchSuplemento = async () => {
    const q = query(collection(db, 'suplements'), where('disponible', '==', true));
    const querySnapshot = await getDocs(q);
    const results = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.nombre.toLowerCase().includes(searchTerm.toLowerCase()) && data.cantidad >= 1) {
        results.push(data);
      }
    });

    setItems(results);
  };


  const handleSearchGanador = async () => {
    const querySnapshot = await getDocs(collection(db, 'User')); // Obtén todos los documentos de 'User'
  
    const foundGanadores = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((data) => 
        data.nombre.toLowerCase().includes(searchGanador.toLowerCase()) // Filtra por el término de búsqueda
      );
  
    setGanadores(foundGanadores);
  };
//------------------------------------------------------------------------------------------





//------------------------------------------------------------------------------------------

  const handleGanadorSelect = (usuario) => {
    setGanadorSeleccionado(usuario);
    setGanador(usuario.nombre); // Para que el nombre quede en el input
    setSearchGanador(''); // Limpiar el término de búsqueda
    setGanadores([]); // Limpiar la lista de artículos
  };
  

  const handleArticuloSelect = (articulo) => {
    setItemSeleccionado(articulo);
    setDescripcion(articulo.description); // Tomar descripción del artículo seleccionado
    setImageUrl(articulo.imageID);
    setSearchTerm(''); // Limpiar el término de búsqueda
    setItems([]); // Limpiar la lista de artículos
  };

  const handleSuplementsSelect = (suplement) => {
    setItemSeleccionado(suplement);
    setDescripcion(suplement.descripcion); // Tomar descripción del artículo seleccionado
    setImageUrl(suplement.url);
    setSearchTerm(''); // Limpiar el término de búsqueda
    setItems([]); // Limpiar la lista de artículos
  };
//------------------------------------------------------------------------------------------
  



  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl('');
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let imageUrlToUse = imageUrl; // Mantiene la URL que usaremos
  
    // Subir imagen solo si no es un artículo
    if (tipoPremio === 'otros') {
      if (!image) {
        Swal.fire('Error', 'Por favor, sube una imagen.', 'error');
        return;
      }
  
      const storageRef = ref(storage, `rewards/${image.name}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
  
      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          },
          (error) => {
            console.error('Error uploading image:', error);
            Swal.fire('Error', 'Error al subir la imagen.', 'error');
            reject(error);
          },
          async () => {
            imageUrlToUse = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(); // Finaliza la promesa después de obtener el URL
          }
        );
      });
    }
  
    // Establecer la fecha válida a un mes a partir de ahora
    const fechaValida = new Date();
    fechaValida.setMonth(fechaValida.getMonth() + 1);
    const fechaValidaString = fechaValida.toISOString().split('T')[0];
  
    const newReward = {
      nombre:
        tipoPremio === 'articulo'
          ? itemSeleccionado.name // Nombre del artículo
          : tipoPremio === 'suplemento'
          ? itemSeleccionado.name // Nombre del suplemento
          : '', // Para 'otros', se dejaría vacío, ya que se ingresará manualmente en el formulario
      descripcion:
        tipoPremio === 'articulo'
          ? itemSeleccionado.description // Descripción del artículo
          : tipoPremio === 'suplemento'
          ? itemSeleccionado.descripcion // Descripción del suplemento
          : descripcion, // Para 'otros', se toma del campo de texto del formulario
      estado,
      ganador,
      url: imageUrlToUse, // Usar el URL ya existente si es un artículo o el nuevo si es un suplemento
      valido: fechaValidaString,
    };
  
    try {
      await addDoc(collection(db, 'rewards'), newReward);
      Swal.fire('Excelente', 'Premio agregado correctamente.', 'success');
      onClose(); // Cerrar el modal después de agregar
    } catch (error) {
      console.error('Error al agregar premio:', error);
      Swal.fire('Error', 'Hubo un error al agregar el premio.', 'error');
    }
  };
  

  return (
    <div className="admin-add-reward-container">
        <h1 className="admin-add-reward-title">Agregar nuevo premio</h1>
        <div className="admin-add-reward-back-container">
            <button type="button" className="admin-add-reward-back-button" onClick={onClose}>Volver</button>
        </div>

        <form onSubmit={handleSubmit} className="admin-add-reward-form">
            <div className="division-form-entry">
                <div className="left">
                <div className="admin-add-reward-form-group">
                    <label className="admin-add-reward-label">Imagen</label>
                    {tipoPremio === 'articulo' && itemSeleccionado ? (
                        // Mostrar la imagen del artículo seleccionado si el tipo de premio es un artículo
                        <div className="uploaded-image-container">
                            <img src={itemSeleccionado.imageID} alt="Artículo seleccionado" className="uploaded-image" />
                        </div>
                    ) : tipoPremio === 'suplemento' && itemSeleccionado ? (
                        // Mostrar la imagen del suplemento seleccionado si el tipo de premio es un suplemento
                        <div className="uploaded-image-container">
                            <img src={itemSeleccionado.url} alt="Suplemento seleccionado" className="uploaded-image" />
                        </div>
                    ) : (
                        // Permitir la subida de una imagen si no es un artículo ni suplemento
                        <>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImage(e.target.files[0])}
                            className="admin-add-reward-input"
                            required
                        />
                        {image && (
                            <div className="uploaded-image-container">
                            <img src={URL.createObjectURL(image)} alt="Suplemento" className="uploaded-image" />
                            <button type="button" onClick={handleRemoveImage} className="remove-image-button">
                                Eliminar imagen
                            </button>
                            </div>
                        )}
                        </>
                    )}
                    </div>

                </div>

                <div className="right">
                    <div className="admin-add-reward-form-group">
                        <label className="admin-add-reward-label">Tipo de premio</label>
                        <select
                            value={tipoPremio}
                            onChange={(e) => setTipoPremio(e.target.value)}
                            className="admin-add-reward-select"
                        >
                            <option value="articulo">Artículo</option>
                            <option value="suplemento">Suplemento</option>
                            <option value="otros">Otros</option>
                        </select>
                    </div>

                    {tipoPremio === 'articulo' && (
                    <div className='cont-art'>
                        <input
                            type="text"
                            placeholder="Buscar artículo"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-add-reward-input"
                        />
                        <button type="button" onClick={handleSearchArticulo}>Buscar</button>
                        {items.length > 0 && (
                            <div className="articulo-list">
                                {items.map((articulo) => (
                                <div key={articulo.id} onClick={() => handleArticuloSelect(articulo)} className="articulo-item">
                                    {articulo.name}
                                </div>
                                ))}
                            </div>
                        )}
                        {itemSeleccionado && (
                            <div className="articulo-selected">
                                <p>Artículo seleccionado: {itemSeleccionado.name}</p>
                                <p>Descripción: {itemSeleccionado.description}</p>
                            </div>
                        )}
                    </div>
                    )}

                    {tipoPremio === 'suplemento' && (
                    <div className='cont-art'>
                        <input
                            type="text"
                            placeholder="Buscar suplemento"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="admin-add-reward-input"
                        />
                        <button type="button" onClick={handleSearchSuplemento}>Buscar</button>
                        {items.length > 0 && (
                            <div className="articulo-list">
                                {items.map((suplemento) => (
                                <div key={suplemento.id} onClick={() => handleSuplementsSelect(suplemento)} className="articulo-item">
                                    {suplemento.name}
                                </div>
                                ))}
                            </div>
                        )}
                        {itemSeleccionado && (
                            <div className="articulo-selected">
                                <p>Artículo seleccionado: {itemSeleccionado.name}</p>
                                <p>Descripción: {itemSeleccionado.descripcion}</p>
                            </div>
                        )}
                    </div>
                    )}      

                    {(tipoPremio === 'otros') && (
                    <>
                        <div className="admin-add-reward-form-group">
                        <label className="admin-add-reward-label">Nombre</label>
                        <input
                            type="text"
                            value={tipoPremio === 'otros' ? 'Otro premio' : ''}
                            className="admin-add-reward-input"
                            disabled={tipoPremio === 'articulo'}
                            required
                        />
                        </div>

                        <div className="admin-add-reward-form-group">
                        <label className="admin-add-reward-label">Descripción</label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="admin-add-reward-textarea"
                            required
                        />
                        </div>
                    </>
                    )}

                    <div className="admin-add-reward-form-group">
                        <label className="admin-add-reward-label">Estado</label>
                        <select
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                            className="admin-add-reward-select"
                            required
                        >
                            <option value="sin reclamar">Sin reclamar</option>
                            <option value="reclamado">Reclamado</option>
                            <option value="vencido">Vencido</option>
                        </select>
                    </div>

                    <div className="cont-art">
                        <input
                            type="text"
                            placeholder="Buscar ganador"
                            value={searchGanador}
                            onChange={(e) => setSearchGanador(e.target.value)}
                            className="admin-add-reward-input"
                        />
                        <button type="button" onClick={handleSearchGanador}>Buscar</button>
                        
                        {ganadores.length > 0 && (
                            <div className="articulo-list">
                                {ganadores.map((usuario) => (
                                    <div key={usuario.id} onClick={() => handleGanadorSelect(usuario)} className="articulo-item">
                                    {usuario.nombre}
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {ganadorSeleccionado && (
                            <div className="articulo-selected">
                            <p>Ganador seleccionado: {ganadorSeleccionado.nombre}</p>
                            </div>
                        )}
                    </div>

                </div>

                

                
            </div>
            

            <div className="admin-add-reward-form-button">
                <button type="submit" className="admin-add-reward-submit-button">Agregar</button>
            </div>
        </form>
    </div>
  );
};

export default AdminAddReward;
