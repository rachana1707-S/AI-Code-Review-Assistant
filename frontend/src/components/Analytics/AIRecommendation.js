import React from "react";

import {
FaLightbulb
} from "react-icons/fa";


import "./Analytics.css";



function AIRecommendation({issues}){


return(

<div className="recommendations">


<h2>
AI Recommendations
</h2>



{

issues.map(
(issue,index)=>(


<div
className="recommend-card"
key={index}
>


<FaLightbulb/>


<div>


<h3>

{
issue.title ||
"Code Improvement"
}

</h3>


<p>

{
issue.message ||
"Improve code quality following best practices."
}

</p>


</div>


</div>


)

)

}



</div>

);


}


export default AIRecommendation;