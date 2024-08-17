import React from 'react';

import appFirebase from '../firebaseConfig/firebase';
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

    // mostrar email
    const userF = auth.currentUser;
    console.log(userF.email);

    return (
        <div>
            <h1>Home Admin</h1>
            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    );
    
};

export default HomeAdminComponent;