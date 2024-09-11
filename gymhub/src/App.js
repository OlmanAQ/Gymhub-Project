import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
//import InicioSesionComponet from './components/registro-login/InicioSesionComponent';
import AdminComponent from './components/administrador/AdminComponent';
function App() {
  return (
    <div className="App">
      <AdminComponent/>
      {/*<InicioSesionComponet/>*/}
    </div>
  );
}

export default App;
// Bug de la paginacion
// Boton refrescar tabla