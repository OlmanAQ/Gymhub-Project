import './App.css';
import InicioSesionComponet from './components/registro-login/InicioSesionComponet';
import AdminComponent from './components/administrador/AdminComponent';
function App() {
  return (
    <div className="App">
      {/*<InicioSesionComponet/>*/}
      <AdminComponent/>
    </div>
  );
}

export default App;
