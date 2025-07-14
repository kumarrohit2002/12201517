const express=require('express');

const app=express();
const cors=require('cors');
app.use(cors()); 

require('dotenv').config(); 

PORT=process.env.PORT || 3000;


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


//db connection
const { dbConnection } = require('./src/config');
dbConnection();


//mounting the All routes
const allRoutes=require('./src/routes');
app.use('/api',allRoutes);


//defaul route
app.get('/',(req,res)=>{
    res.send('Hello from the Express server!');
});


app.listen(PORT,()=>{
    console.log(`Server is running on url: http://localhost:${PORT}`);
});