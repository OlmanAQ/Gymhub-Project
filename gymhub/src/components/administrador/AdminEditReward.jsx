import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConfig/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const AdminEditReward = ({ rewardId, onClose }) => {
  const [rewardData, setRewardData] = useState({
    nombre: '',
    descripcion: '',
    estado: '',
    ganador: '',
    url: '',
    valido: ''
  });

  return (
    <div className="edit-reward-container">
      
     
    </div>
  );
};

export default AdminEditReward;
