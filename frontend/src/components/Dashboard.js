import React, {
  useState,
  useRef,
  useEffect
} from "react";

import Editor from "@monaco-editor/react";

import {
  FaHome,
  FaHistory,
  FaCog,
  FaUpload,
  FaBug,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";

import { uploadCode } from "../services/api";

import "./Dashboard.css";


function Dashboard() {


  const [file, setFile] = useState(null);

  const [code, setCode] = useState("");

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);



  const editorRef = useRef(null);

  const resizeObserverRef = useRef(null);

  const monacoRef = useRef(null);





  /*
      Monaco Editor Setup
  */

  const handleEditorDidMount = (
    editor,
    monaco
  ) => {


    editorRef.current = editor;

    monacoRef.current = monaco;



    const container =
      editor.getDomNode();



    if (container) {


      resizeObserverRef.current =
        new ResizeObserver(() => {


          requestAnimationFrame(() => {


            editor.layout();


          });


        });



      resizeObserverRef.current.observe(
        container
      );


    }


  };




  /*
      Cleanup Resize Observer
  */

  useEffect(() => {


    return () => {


      if (
        resizeObserverRef.current
      ) {


        resizeObserverRef.current.disconnect();


      }


    };


  }, []);







  /*
      File Selection
  */

  const handleFileChange = (event) => {


    const selectedFile =
      event.target.files[0];


    if (!selectedFile) return;



    setFile(selectedFile);



    const reader =
      new FileReader();



    reader.onload = (e) => {


      setCode(e.target.result);


    };



    reader.readAsText(
      selectedFile
    );


  };







  /*
      Upload Code
  */

  const handleUpload = async () => {


    if (!file) {


      alert(
        "Please select a code file"
      );


      return;


    }



    try {


      setLoading(true);



      const response =
        await uploadCode(file);



      setData(response);



    }

    catch(error){


      console.error(
        "Upload failed:",
        error
      );


    }

    finally {


      setLoading(false);


    }


  };







  /*
      AI Severity Mapping
  */

  const mapSeverity = (label) => {


    if (
      label === "LABEL_1"
    )

      return "HIGH";



    if (
      label === "LABEL_0"
    )

      return "LOW";



    return "MEDIUM";


  };








  /*
      Severity Colors
  */

  const getSeverityIcon = (
    severity
  ) => {


    if (
      severity === "HIGH"
    )

      return <FaBug/>;



    if (
      severity === "MEDIUM"
    )

      return <FaShieldAlt/>;



    return <FaCheckCircle/>;


  };








  /*
      Backend Compatibility

      Supports:

      analysis:[]
      ai_review:[]

  */

  const issues =
    data?.analysis ||
    data?.ai_review ||
    [];








  /*
      Highlight Issues
  */

  useEffect(() => {


    if (
      !editorRef.current ||
      !monacoRef.current
    )

      return;



    const decorations =
      issues
      .filter(
        item => item.line
      )
      .map(
        item => {


          const severity =
            mapSeverity(
              item.label
            );



          return {


            range:
              new monacoRef.current.Range(

                item.line,

                1,

                item.line,

                1

              ),



            options:{


              isWholeLine:true,


              className:
                `line-${severity.toLowerCase()}`


            }


          };


        }

      );



    editorRef.current.deltaDecorations(
      [],
      decorations
    );



  }, [data]);








  /*
      Jump To Issue Line
  */

  const jumpToLine = (
    line
  ) => {


    if(
      !line ||
      !editorRef.current
    )

      return;



    editorRef.current.revealLineInCenter(
      line
    );


    editorRef.current.focus();


  };







  return (


    <div className="dashboard">



      {/* Sidebar */}

      <aside className="sidebar">


        <h2>
          🤖 CodeAI
        </h2>



        <div className="menu">


          <p>
            <FaHome/>
            Dashboard
          </p>



          <p>
            <FaHistory/>
            Reviews
          </p>



          <p>
            <FaCog/>
            Settings
          </p>


        </div>


      </aside>








      {/* Main */}

      <main className="main-panel">


        <h1>
          AI Code Review
        </h1>


        <p className="subtitle">
          Analyze your code with AI powered insights
        </p>






        {/* Upload */}

        <div className="upload-bar">


          <input

            type="file"

            accept=".py,.java,.js"

            onChange={
              handleFileChange
            }

          />



          <button
            onClick={
              handleUpload
            }
          >

            <FaUpload/>


            {
              loading
              ?
              "Analyzing..."
              :
              "Analyze"
            }


          </button>



        </div>







        {/* Editor + Issues */}

        <div className="split-view">






          <div className="editor-container">


            <Editor


              height="500px"


              language="python"


              value={code}


              theme="vs-dark"


              onMount={
                handleEditorDidMount
              }


              options={{

                fontSize:14,

                minimap:{
                  enabled:false
                },

                automaticLayout:true

              }}


            />


          </div>









          <div className="issues-panel">


            <h2>
              AI Findings
            </h2>




            {
              issues.length===0 &&

              <p>
                No issues detected yet
              </p>

            }






            {
              issues.map(
                (item,index)=>{


                  const severity =
                    mapSeverity(
                      item.label
                    );



                  return (


                    <div

                      key={index}

                      className={
                        `issue-card ${severity.toLowerCase()}`
                      }


                      onClick={() =>
                        jumpToLine(
                          item.line
                        )
                      }


                    >


                      {
                        getSeverityIcon(
                          severity
                        )
                      }



                      <div>


                        <h3>
                          {severity}
                        </h3>



                        <p>
                          Line:
                          {
                            item.line ||
                            "N/A"
                          }
                        </p>



                        <p>

                          Confidence:
                          {
                            item.score
                            ?
                            Number(
                              item.score
                            ).toFixed(2)
                            :
                            "N/A"
                          }

                        </p>


                      </div>


                    </div>


                  );


                }

              )

            }



          </div>




        </div>



      </main>



    </div>


  );


}



export default Dashboard;