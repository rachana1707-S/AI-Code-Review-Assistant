import React, {useState} from "react";
import axios from "axios";

import {
    FaCloudUploadAlt,
    FaRobot,
    FaFileCode
} from "react-icons/fa";


import "./Upload.css";



function Upload(){


const [file,setFile]=useState(null);

const [result,setResult]=useState(null);

const [loading,setLoading]=useState(false);



const uploadFile=async()=>{


if(!file){

alert("Select a file first");

return;

}


const formData=new FormData();

formData.append(
"file",
file
);



try{


setLoading(true);


const response =
await axios.post(

"http://127.0.0.1:8000/upload",

formData

);



setResult(response.data);


}

catch(error){

console.log(error);

}


setLoading(false);


};




return(


<div className="upload-card">



<div className="icon-circle">

<FaRobot/>

</div>



<h2>

AI Powered Code Analysis

</h2>



<p>

Upload your source code and get intelligent
feedback.

</p>



<label className="upload-box">


<FaCloudUploadAlt size={40}/>


<span>

{
file?
file.name:
"Choose code file"
}

</span>



<input

type="file"

onChange={
(e)=>setFile(e.target.files[0])
}

/>


</label>




<button

onClick={uploadFile}

>


<FaFileCode/>

{

loading?

"Analyzing..."

:

"Review Code"

}



</button>



{


result &&

<div className="result-box">


<h3>
AI Review Result
</h3>


<pre>

{
JSON.stringify(
result,
null,
2
)
}


</pre>


</div>


}




</div>


);


}


export default Upload;