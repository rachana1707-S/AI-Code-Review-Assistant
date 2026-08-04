import React from "react";
import "./Analytics.css";


function QualityScore({score}) {


return (

<div className="score-card">


<h2>
Code Quality
</h2>


<div className="circle">


<span>
{score}
</span>


</div>


<p>
out of 100
</p>


</div>

);


}


export default QualityScore;