import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig/firebase';
import '../../css/TrainerCreatePlanComponent.css';
import Swal from 'sweetalert2';

function TrainerCreatePlanComponent( {onClose} ) {

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const [routineName, setRoutineName] = useState('');
  const [weeklyRoutine, setWeeklyRoutine] = useState({
    Lunes: [],
    Martes: [],
    Miércoles: [],
    Jueves: [],
    Viernes: [],
    Sábado: [],
    Domingo: [],
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
        `<label for="sets" style="display:block; text-align:left; margin-bottom:5px;">Series:</label>` +
        `<input id="sets" type="number" placeholder="Número de series" class="swal2-input" style="margin-bottom:10px;">` +
        `<label for="reps" style="display:block; text-align:left; margin-bottom:5px;">Repeticiones:</label>` +
        `<input id="reps" type="number" placeholder="Número de repeticiones" class="swal2-input">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Agregar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const sets = Swal.getPopup().querySelector('#sets').value;
        const reps = Swal.getPopup().querySelector('#reps').value;
  
        if (!sets || !reps) {
          Swal.showValidationMessage(`Por favor ingresa el número de series y repeticiones`);
          return null;
        }
  
        return { sets, reps };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const { sets, reps } = result.value;
        const exerciseDetails = {
          [exercise]: { Repeticiones: reps, Series: sets },
        };
  
        setWeeklyRoutine((prevRoutine) => ({
          ...prevRoutine,
          [day]: [...prevRoutine[day], exerciseDetails],
        }));
      }
    });
  };


  const removeExerciseFromDay = (day, exercise) => {
    setWeeklyRoutine((prevRoutine) => ({
      ...prevRoutine,
      [day]: prevRoutine[day].filter((ex) => !ex[exercise]),
    }));
  };

  const fetchUsers = async () => {
    if (searchQuery.length > 2) {
      const q = query(
        collection(db, 'User'),
        where('nombre', '>=', searchQuery),
        where('nombre', '<=', searchQuery + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(fetchedUsers);
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
      Swal.fire({
        title: "Cuidado!",
        text: "Por favor, selecciona un usuario para asignar la rutina.",
        icon: "warning"
      });
      return;
    }
    if (!routineName) {
      Swal.fire({
        title: "Cuidado!",
        text: "Por favor, asigna un nombre a la rutina.",
        icon: "warning"
      });
      return;
    }
    const currentDate = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    try {
      await addDoc(collection(db, 'plans'), {
        usuario: selectedUser.usuario,
        nombre: routineName,
        rutina: weeklyRoutine,
        fechaCreacion: currentDate, 
        estado: activityState 
      });
      Swal.fire({
        title: "Excelente!",
        text: "Rutina agregada exitosamente!",
        icon: "success"
      });
    } catch (error) {
      console.error('Error al guardar la rutina: ', error);
      Swal.fire({
        title: "Error!",
        text: "Algo ha fallado al guardar rutina",
        icon: "error"
      });
    }
  };


  useEffect(() => {
    const fetchMuscleGroups = async () => {
      try {
        const docRef = collection(db, 'gmusculares');
        const querySnapshot = await getDocs(docRef);
        if (!querySnapshot.empty) {
          const data = querySnapshot.docs[0].data();
          setMuscleGroups(Object.entries(data).map(([group, exercises]) => ({
            group,
            exercises
          })));
        }
      } catch (error) {
        console.error('Error fetching muscle groups: ', error);
      }
    };
    fetchMuscleGroups();
  }, []);


  const MuscleGroup = ({ group, exercises }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <div className="c-muscle-group">
        <button onClick={toggleExpand} className="c-muscle-group-button">
          {group}
        </button>
        {isExpanded && (
          <div className="c-exercise-list">
            {exercises.map((exercise, index) => (
              <button
                key={index}
                className="c-exercise-button"
                onClick={() => addExerciseToDay(selectedDay, exercise)}
              >
                {exercise}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="conte-prin">
      <h1 className="title">Creación de rutina</h1>
      <div className="btn-bck-cont">
        <button type="button" className="bck-btn" onClick={onClose}>Volver</button>
      </div>

      <div className='wrapper'>
        <div className="ipt-container">
          <div className="srch-container">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuario..."
              className="user-sch-input"
            />
            <button onClick={fetchUsers} className="user-sch-button">
              Buscar usuario
            </button>
            {users.length > 0 && (
              <ul className="c-user-list">
                {users.map((user) => (
                  <li key={user.id} onClick={() => handleUserSelect(user)}>
                    {user.nombre} ({user.usuario})
                  </li>
                ))}
              </ul>
            )}
            {selectedUser && (
              <div className="c-selected-user">
                <p>Usuario seleccionado: {selectedUser.nombre} ({selectedUser.usuario})</p>
              </div>
            )}
          </div>

          <div className="rt-name-container">
            <input
              type="text"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="Nombre de la rutina"
              className="rt-name-input"
            />
          </div>
          
          <div className="act-st-container">
            <label>
              Estado de rutina
            </label>
            <select
                value={activityState}
                onChange={(e) => setActivityState(e.target.value === 'true')}
                className='activity-state-select'
              >
                <option value={false}>Inactiva</option>
                <option value={true}>Activa</option>
            </select>
          </div>

        </div>
      </div>



      <div className="c-exercise-menu">
        {muscleGroups.map((muscleGroup, index) => (
          <MuscleGroup
            key={index}
            group={muscleGroup.group}
            exercises={muscleGroup.exercises}
          />
        ))}
      </div>


      <div className='wrapper'>
        <div className="c-days-container">
          <div className="c-weekly-plan">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className={`c-day-column ${selectedDay === day ? 'c-active-day' : ''}`}
              >
                <h2 onClick={() => setSelectedDay(day)}>{day}</h2>
                <ul>
                  {weeklyRoutine[day].map((exerciseObj, index) => {
                    const exercise = Object.keys(exerciseObj)[0];
                    const details = exerciseObj[exercise];
                    return (
                      <li key={index}>
                        {`${exercise} - ${details.Series} sets x ${details.Repeticiones} reps`}
                        <button className="c-remove-button" onClick={() => removeExerciseFromDay(day, exercise)} >
                          X
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>


      <button className="btn-grd" onClick={saveRoutine}>
        Guardar rutina
      </button>
    </div>
  );
}

export default TrainerCreatePlanComponent;
