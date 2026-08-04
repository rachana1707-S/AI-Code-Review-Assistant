import React from "react";

import {
PieChart,
Pie,
Cell,
Tooltip
} from "recharts";


import "./Analytics.css";



function IssueChart({issues}) {



const data=[

{
name:"High",
value:
issues.filter(
i=>i.severity==="HIGH"
).length
},


{
name:"Medium",
value:
issues.filter(
i=>i.severity==="MEDIUM"
).length
},


{
name:"Low",
value:
issues.filter(
i=>i.severity==="LOW"
).length
}


];




return (

<div className="chart-card">


<h2>
Issue Distribution
</h2>


<PieChart width={300} height={250}>


<Pie

data={data}

dataKey="value"

cx="50%"

cy="50%"

outerRadius={80}

label


>


{
data.map(
(entry,index)=>(

<Cell key={index}/>

)
)

}


</Pie>


<Tooltip/>


</PieChart>



</div>


);


}


export default IssueChart;