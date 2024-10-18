import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig/firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Swal from 'sweetalert2';
import '../../css/AdminEditReward.css';

const AdminEditReward = ({ reward, onClose }) => {
  const [tipoPremio, setTipoPremio] = useState(reward.tpremio || 'articulo');
  const [itemSeleccionado, setItemSeleccionado] = useState(null);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [nombre, setNombre] = useState(reward.nombre || '');
  const [descripcion, setDescripcion] = useState(reward.descripcion || '');
  const [estado, setEstado] = useState(reward.estado || 'sin reclamar');
  const [ganador, setGanador] = useState(reward.ganador || '');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(reward.url || '');
  const storage = getStorage();
  const [searchGanador, setSearchGanador] = useState('');
  const [ganadores, setGanadores] = useState([]);
  const [ganadorSeleccionado, setGanadorSeleccionado] = useState(null);

  useEffect(() => {
    if (reward) {
      setNombre(reward.nombre || '');
      setDescripcion(reward.descripcion || '');
      setEstado(reward.estado || 'sin reclamar');
      setGanador(reward.ganador || '');
      setImageUrl(reward.url || '');
      setTipoPremio(reward.tpremio || 'articulo');
    }
  }, [reward]);

  useEffect(() => {
    if (image) {
      const imageUrl = URL.createObjectURL(image);
      setImageUrl(imageUrl);
      return () => URL.revokeObjectURL(imageUrl);
    }
  }, [image]);

  

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
    const querySnapshot = await getDocs(collection(db, 'User'));

    const foundGanadores = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((data) =>
        data.nombre.toLowerCase().includes(searchGanador.toLowerCase())
      );

    setGanadores(foundGanadores);
  };
  //------------------------------------------------------------------------------------------

  const handleGanadorSelect = (usuario) => {
    setGanadorSeleccionado(usuario);
    setGanador(usuario.nombre);
    setSearchGanador('');
    setGanadores([]);
  };

  const handleArticuloSelect = (articulo) => {
    setItemSeleccionado(articulo);
    setDescripcion(articulo.description);
    setImageUrl(articulo.imageID);
    setSearchTerm('');
    setItems([]);
  };

  const handleSuplementsSelect = (suplement) => {
    setItemSeleccionado(suplement);
    setNombre(suplement.nombre);
    setDescripcion(suplement.descripcion);
    setImageUrl(suplement.url);
    setSearchTerm('');
    setItems([]);
  };
  //------------------------------------------------------------------------------------------


  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrlToUse = imageUrl;

    if (tipoPremio === 'otros' && image) {
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
            resolve();
          }
        );
      });
    }

    const fechaValidaString = reward.valido;

    const updatedReward = {
      nombre:
        tipoPremio === 'articulo'
          ? itemSeleccionado?.name || reward.nombre
          : tipoPremio === 'suplemento'
          ? itemSeleccionado?.nombre || reward.nombre
          : nombre,
      descripcion:
        tipoPremio === 'articulo'
          ? itemSeleccionado?.description || reward.descripcion
          : tipoPremio === 'suplemento'
          ? itemSeleccionado?.descripcion || reward.descripcion
          : descripcion,
      estado,
      ganador,
      url: imageUrlToUse,
      valido: fechaValidaString,
      tpremio: tipoPremio,
    };

    try {
      const rewardRef = doc(db, 'rewards', reward.id);
      await updateDoc(rewardRef, updatedReward);
      Swal.fire('Excelente', 'Premio actualizado correctamente.', 'success');
      onClose();
    } catch (error) {
      console.error('Error al actualizar premio:', error);
      Swal.fire('Error', 'Hubo un error al actualizar el premio.', 'error');
    }
  };

  return (
    <div className="edit-reward-container">
      <h1 className="edit-reward-title">Editar premio</h1>
      <div className="edit-reward-back-container">
        <button type="button" className="edit-reward-back-button" onClick={onClose}>
          Volver
        </button>
      </div>

      {reward.tpremio === 'articulo' || (tipoPremio === 'articulo' && itemSeleccionado) ? (
        <form onSubmit={handleSubmit} className="edit-reward-form">

          <div className="division-form-ent">
            <div className="left-part">
              <div className="edit-reward-form-group">
                <label className="edit-reward-label">Imagen</label>
                {imageUrl ? (
                  <div className="uploaded-img-cont">
                    <img src={imageUrl} alt="Imagen del artículo" className="uploaded-img" />
                  </div>
                ) : (
                  <input
                  
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="edit-reward-input"
                    required={!imageUrl} 
                  />
                )}
              </div>
            </div>
        
            <div className="right-part">
              <div className="cont-art">
                <input
                  type="text"
                  placeholder="Buscar artículo"
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="edit-reward-input"
                />
                <button type="button" className='edit-search-button' onClick={handleSearchArticulo}>Buscar</button>
                {items.length > 0 && (
                  <div className="articulo-list">
                    {items.map((articulo) => (
                      <div key={articulo.id} onClick={() => handleArticuloSelect(articulo)} className="articulo-item">
                        {articulo.name}
                      </div>
                    ))}
                  </div>
                )}

                {(reward.nombre || itemSeleccionado) && (
                  <div className="articulo-selected">
                    <p>Artículo seleccionado: {reward.nombre || itemSeleccionado.name}</p>
                    <p>Descripción: {reward.descripcion || itemSeleccionado.description}</p>
                  </div>
                )}
              </div>
        
              <div className="edit-reward-form-group">
                <label className="edit-reward-label">Estado</label>
                <select
                  value={estado} 
                  onChange={(e) => setEstado(e.target.value)} 
                  className="edit-reward-select"
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
                  className="edit-reward-input"
                />
                <button type="button" className='edit-search-button' onClick={handleSearchGanador}>Buscar</button>
        
                {ganadores.length > 0 && (
                  <div className="articulo-list">
                    {ganadores.map((usuario) => (
                      <div key={usuario.id} onClick={() => handleGanadorSelect(usuario)} className="articulo-item">
                        {usuario.nombre}
                      </div>
                    ))}
                  </div>
                )}
        
                {(reward.ganador || ganadorSeleccionado) && (
                  <div className="articulo-selected">
                    <p>Ganador seleccionado: {ganadorSeleccionado?.nombre || reward.ganador}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        
          <div className="edit-submit-container">
            <button type="submit" className="edit-reward-submit-button">Actualizar</button>
          </div>
        </form>
      

      ) : reward.tpremio === 'suplemento' || (tipoPremio === 'suplemento' && itemSeleccionado) ? (
        <form onSubmit={handleSubmit} className="edit-reward-form">
          <div className="division-form-ent">
            <div className="left-part">
              <div className="edit-reward-form-group">
                <label className="edit-reward-label">Imagen</label>
                {imageUrl ? (
                  <div className="uploaded-img-cont">
                    <img src={imageUrl} alt="Imagen del suplemento" className="uploaded-img" />
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="edit-reward-input"
                    required={!imageUrl} 
                  />
                )}
              </div>
            </div>

            <div className="right-part">
              <div className="cont-art">
                <input
                  type="text"
                  placeholder="Buscar suplemento"
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="edit-reward-input"
                />
                <button type="button" className='edit-search-button' onClick={handleSearchSuplemento}>Buscar</button>
                {items.length > 0 && (
                  <div className="articulo-list">
                    {items.map((suplemento) => (
                      <div key={suplemento.id} onClick={() => handleSuplementsSelect(suplemento)} className="articulo-item">
                        {suplemento.nombre}
                      </div>
                    ))}
                  </div>
                )}
                
                {(reward.nombre || itemSeleccionado) && ( 
                  <div className="articulo-selected">
                    <p>Suplemento seleccionado: {itemSeleccionado?.nombre || reward.nombre}</p>
                    <p>Descripción: {itemSeleccionado?.descripcion || reward.descripcion}</p>
                  </div>
                )}
              </div>

              <div className="edit-reward-form-group">
                <label className="edit-reward-label">Estado</label>
                <select
                  value={estado} 
                  onChange={(e) => setEstado(e.target.value)} 
                  className="edit-reward-select"
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
                  className="edit-reward-input"
                />
                <button type="button" className='edit-search-button' onClick={handleSearchGanador}>Buscar</button>

                {ganadores.length > 0 && (
                  <div className="articulo-list">
                    {ganadores.map((usuario) => (
                      <div key={usuario.id} onClick={() => handleGanadorSelect(usuario)} className="articulo-item">
                        {usuario.nombre}
                      </div>
                    ))}
                  </div>
                )}

                {(reward.ganador || ganadorSeleccionado) && (
                  <div className="articulo-selected">
                    <p>Ganador seleccionado: {ganadorSeleccionado?.nombre || reward.ganador}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="edit-submit-container">
            <button type="submit" className="edit-reward-submit-button">Actualizar</button>
          </div>
        </form>


      ) : (
        <form onSubmit={handleSubmit} className="edit-reward-form">
          <div className="division-form-ent">
            <div className="left-part">
              <div className="edit-reward-form-group">
                <label className="edit-reward-label">Imagen</label>
                {imageUrl ? (
                  <div className="uploaded-img-cont">
                    <img src={imageUrl} alt="Imagen del premio" className="uploaded-img" />
                    <button type="button" onClick={handleRemoveImage} className="remove-image-btn">
                      Eliminar imagen
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="edit-reward-input"
                    required={!imageUrl} 
                  />
                )}
              </div>
            </div>

            <div className="right-part">
              <div className="edit-reward-form-group">
                <label className="edit-reward-label">Nombre</label>
                <input
                  type="text"
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  className="edit-reward-input"
                  required
                />
              </div>

              <div className="edit-reward-form-group">
                <label className="edit-reward-label">Descripción</label>
                <textarea
                  value={descripcion} 
                  onChange={(e) => setDescripcion(e.target.value)} 
                  className="edit-reward-textarea"
                  required
                />
              </div>

              <div className="edit-reward-form-group">
                <label className="edit-reward-label">Estado</label>
                <select
                  value={estado} 
                  onChange={(e) => setEstado(e.target.value)} 
                  className="edit-reward-select"
                  required
                >
                  <option value="sin reclamar">Sin reclamar</option>
                  <option value="reclamado">Reclamado</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>

              <div className="edit-reward-form-group">
                <label className="edit-reward-label">Ganador</label>
                <input
                  type="text"
                  placeholder="Buscar ganador"
                  value={searchGanador}
                  onChange={(e) => setSearchGanador(e.target.value)}
                  className="edit-reward-input"
                />
                <button type="button" className='edit-search-button' onClick={handleSearchGanador}>Buscar</button>

                {ganadores.length > 0 && (
                  <div className="articulo-list">
                    {ganadores.map((usuario) => (
                      <div key={usuario.id} onClick={() => handleGanadorSelect(usuario)} className="articulo-item">
                        {usuario.nombre}
                      </div>
                    ))}
                  </div>
                )}

                {(reward.ganador || ganadorSeleccionado) && (
                  <div className="articulo-selected">
                    <p>Ganador seleccionado: {ganadorSeleccionado?.nombre || reward.ganador}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="edit-submit-container">
            <button type="submit" className="edit-reward-submit-button">Actualizar</button>
          </div>
        </form>

      )}


    </div>
  );
};

export default AdminEditReward;
