import './App.css';
import TrainerComponent from './components/entrenador/TrainerComponent';
import TrainerNavBarComponent from './components/entrenador/TrainerNavBarComponent'; 
import TrainingPlanComponent from './components/entrenador/TrainerCreatePlanComponent';

function App() {
  return (
    <div className="App">
      {/*<TrainerCreatePlanComponent/>*/}
      {/*<TrainingPlanComponent>*/}
      <TrainerNavBarComponent/> 
    </div>
  );
}

export default App;
