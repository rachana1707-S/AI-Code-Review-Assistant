import Upload from "./components/Upload";
import "./App.css";


function App() {


  return (

    <div className="app-container">


      <div className="hero">


        <h1>
          AI Code Review Assistant
        </h1>


        <p>
          Analyze your code using AI,
          detect bugs and improve quality.
        </p>


      </div>



      <Upload />


    </div>

  );

}


export default App;