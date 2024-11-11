import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import Swal from 'sweetalert2';
import '../../css/TrainerEditPlanComponent.css';

function TrainerEditPlanComponent({ plan, onClose }) { 


  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];


  const [routineName, setRoutineName] = useState('');
  const [weeklyRoutine, setWeeklyRoutine] = useState({
    Lunes: [], Martes: [], Miércoles: [], Jueves: [], Viernes: [], Sábado: [], Domingo: [],
  });
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activityState, setActivityState] = useState(false);
  const [muscleGroups, setMuscleGroups] = useState([]);

  const addExerciseToDay = (day, exercise) => {
    Swal.fire({
      title: `Agregar detalles para ${exercise}`,
      html: 
        `<label>Series:</label><input id="sets" type="number" placeholder="Número de series" class="swal2-input">` +
        `<label>Repeticiones:</label><input id="reps" type="number" placeholder="Número de repeticiones" class="swal2-input">`,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const sets = Swal.getPopup().querySelector('#sets').value;
        const reps = Swal.getPopup().querySelector('#reps').value;
        if (!sets || !reps) Swal.showValidationMessage(`Ingresa series y repeticiones`);
        return { sets, reps };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { sets, reps } = result.value;
        const exerciseDetails = { [exercise]: { Repeticiones: reps, Series: sets } };
        setWeeklyRoutine(prev => ({ ...prev, [day]: [...prev[day], exerciseDetails] }));
      }
    });
  };

  const removeExerciseFromDay = (day, exercise) => {
    setWeeklyRoutine(prev => ({
      ...prev,
      [day]: prev[day].filter(ex => !ex[exercise]),
    }));
  };

  const fetchUsers = async () => {
    if (searchQuery.length > 2) {
      const q = query(collection(db, 'User'), where('nombre', '>=', searchQuery), where('nombre', '<=', searchQuery + '\uf8ff'));
      const querySnapshot = await getDocs(q);
      setUsers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } else {
      setUsers([]);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setSearchQuery(user.nombre);
    setUsers([]);
  };

  const saveRoutine = async () => {
    if (!selectedUser) {
      Swal.fire("Cuidado!", "Selecciona un usuario.", "warning");
      return;
    }
  
    if (!routineName) {
      Swal.fire("Cuidado!", "Asigna un nombre a la rutina.", "warning");
      return;
    }
  
    try {
      const routineRef = doc(db, 'plans', plan.id);
  
      
      const validState = typeof activityState === 'boolean' ? activityState : false;
  
      await updateDoc(routineRef, {
        usuario: selectedUser.usuario,
        nombre: routineName,
        rutina: weeklyRoutine,
        estado: validState, 
      });
  
      Swal.fire("Excelente!", "Rutina actualizada exitosamente!", "success");
    } catch (error) {
      console.error('Error al actualizar la rutina: ', error);
      Swal.fire("Error!", "No se pudo actualizar la rutina", "error");
    }
  };
  

  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const docRef = collection(db, 'gmusculares');
        const querySnapshot = await getDocs(docRef);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setMuscleGroups(Object.entries(data).map(([group, exercises]) => ({ group, exercises })));
        }
      } catch (error) {
        console.error('Error fetching muscle groups: ', error);
      }
    };

    const fetchRoutine = async () => {
      console.log('plan recibido:', plan);
      try {
        console.log('Llega al try');
        const docRef = doc(db, 'plans', plan.id);
        console.log('docRef', docRef);
        const routineSnapshot = await getDoc(docRef);
        console.log('RoutineSnapshot', routineSnapshot);
        if (routineSnapshot.exists()) {
          const routineData = routineSnapshot.data();
          setRoutineName(routineData.nombre);
          setWeeklyRoutine(routineData.rutina);
          setActivityState(routineData.estado);

          const userQuery = query(collection(db, 'User'), where('usuario', '==', routineData.usuario));
          const userSnapshot = await getDocs(userQuery);
          if (!userSnapshot.empty) {
            setSelectedUser(userSnapshot.docs[0].data());
          }
        } else {
          console.error('No such routine!');
        }
      } catch (error) {
        console.error('Error fetching routine: ', error);
      }
    };

    fetchMuscleGroups();
    fetchRoutine();
  }, [plan]);

  const MuscleGroup = ({ group, exercises }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
      <div className="edit-muscle-group">
        <button onClick={() => setIsExpanded(!isExpanded)} className="edit-muscle-group-button">
          {group}
        </button>
        {isExpanded && (
          <div className="edit-exercise-list">
            {exercises.map((exercise, index) => (
              <button key={index} className="edit-exercise-button" onClick={() => addExerciseToDay(selectedDay, exercise)}>
                {exercise}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mi-contenedor">
      <h1 className="title">Edición de rutina</h1>
      <div className="cont-aux">
        <button type="button" className="back-btn" onClick={onClose}>Volver</button>
      </div>

      <div className='wrapper-cnt'>
        <div className="edit-input-container">
          <div className="edit-user-search-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuario..."
              className="edit-user-search-input"
            />
            <button onClick={fetchUsers} className="edit-user-search-button">Buscar usuario</button>
            {users.length > 0 && (
              <ul className="edit-user-list">
                {users.map(user => (
                  <li key={user.id} onClick={() => handleUserSelect(user)}>
                    {user.nombre} ({user.usuario})
                  </li>
                ))}
              </ul>
            )}
            {selectedUser && (
              <div className="edit-selected-user">
                <p>Usuario seleccionado: {selectedUser.nombre} ({selectedUser.usuario})</p>
              </div>
            )}
          </div>

          <div className="edit-routine-name-container">
            <input
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="Nombre de la rutina"
              className="edit-routine-name-input"
            />
          </div>

          <div className="edit-activity-state-container">
            <label>
              Estado de rutina
            </label>
            <select
                value={activityState}
                onChange={(e) => setActivityState(e.target.value === 'true')} 
                className="edit-activity-state-select"
              >
                <option value="false">Inactiva</option>
                <option value="true">Activa</option>
            </select>
          </div>

        </div>
      </div>
      

      <div className="edit-exercise-menu">
        {muscleGroups.map((muscleGroup, index) => (
          <MuscleGroup key={index} group={muscleGroup.group} exercises={muscleGroup.exercises} />
        ))}
      </div>


      <div className='wrapper-cnt'>
        <div className="edit-days-container">
          <div className="edit-weekly-plan">
            {daysOfWeek.map(day => (
              <div key={day} className={`edit-day-column ${selectedDay === day ? 'edit-active-day' : ''}`}>
                <h2 onClick={() => setSelectedDay(day)}>{day}</h2>
                <ul>
                  {weeklyRoutine[day].map((exerciseObj, index) => {
                    const exercise = Object.keys(exerciseObj)[0];
                    const details = exerciseObj[exercise];
                    return (
                      <li key={index}>
                        {`${exercise} - ${details.Series} sets x ${details.Repeticiones} reps`}
                        <button className="edit-remove-button" onClick={() => removeExerciseFromDay(day, exercise)}>X</button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>


      <button className="btn-act" onClick={saveRoutine}>Guardar Cambios</button>
    </div>
  );
}

export default TrainerEditPlanComponent;
