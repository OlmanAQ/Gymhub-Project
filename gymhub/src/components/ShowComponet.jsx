import React, { useState } from 'react';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';

const ShowComponent = () => {
  const [isLoginVisible, setIsLoginVisible] = useState(true);

  const showRegister = () => {
    setIsLoginVisible(false);
  };

  const showLogin = () => {
    setIsLoginVisible(true);
  };

  return (
    <div>
      {isLoginVisible ? (
        <LoginComponent onShowRegister={showRegister} />
      ) : (
        <RegisterComponent onShowLogin={showLogin} />
      )}
    </div>
  );
};

export default ShowComponent;
