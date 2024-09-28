const initialState = {
  userId: null,
  username: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

const userReducer = (state = initialState, action) => {
	  switch (action.type) {
	case 'LOGIN':
	  return {
		...state,
		userId: action.payload.uid,
		username: action.payload.usuario,
		email: action.payload.correo,
		role: action.payload.rol,
		isAuthenticated: true,
	  };
	case 'LOGOUT':
	  return {
		...state,
		userId: null,
		username: null,
		email: null,
		role: null,
		isAuthenticated: false,
	  };
	default:
	  return state;
  }
}
  

export default userReducer;