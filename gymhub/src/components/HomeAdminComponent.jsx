import React from 'react';
import appFirebase from '../config/firebase';
import { getAuth } from 'firebase/auth';

const auth = getAuth(appFirebase);

const HomeAdminComponent = () => {
    
    // bottom lpg out
    const handleLogout = () => {
        auth.signOut().then(() => {
            console.log('Sesión cerrada');
            
        }).catch((error) => {
            console.log('Error al cerrar sesión', error);
        });
    };

    return (
        <div>
            <h1>Home Admin</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
    
};

export default HomeAdminComponent;