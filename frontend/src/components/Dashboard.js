import React from "react";

import {
FaHome,
FaHistory,
FaCog,
FaBug,
FaShieldAlt,
FaCheckCircle
} from "react-icons/fa";


import {
motion
} from "framer-motion";


import "./Dashboard.css";



function Dashboard(){


return(


<div className="dashboard">



{/* Sidebar */}

<div className="sidebar">


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


</div>





{/* Main */}

<div className="main-panel">


<h1>
AI Code Review Dashboard
</h1>


<p className="subtitle">

Your intelligent coding assistant

</p>





<div className="cards">



<motion.div
className="card score"
whileHover={{
scale:1.05
}}
>

<h3>
Code Quality
</h3>


<h1>
87
<span>
/100
</span>
</h1>


</motion.div>






<motion.div
className="card"
whileHover={{
scale:1.05
}}
>


<FaBug/>


<h3>
Issues Found
</h3>


<h1>
12
</h1>


</motion.div>






<motion.div
className="card"
whileHover={{
scale:1.05
}}
>


<FaShieldAlt/>


<h3>
Security
</h3>


<h1>
Good
</h1>


</motion.div>



</div>






<div className="review-panel">


<h2>
Latest AI Suggestions
</h2>



<div className="issue">

<FaBug/>

<div>

<h3>
Possible Bug
</h3>

<p>
Handle empty input validation.
</p>

</div>


</div>




<div className="issue">

<FaShieldAlt/>

<div>

<h3>
Security Improvement
</h3>

<p>
Avoid hardcoded credentials.
</p>


</div>


</div>






<div className="issue">


<FaCheckCircle/>


<div>

<h3>
Optimization
</h3>


<p>
Improve loop efficiency.
</p>


</div>


</div>


</div>





</div>



</div>


);


}



export default Dashboard;