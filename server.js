const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan')
const connectDB = require ('./config/db')
const authRoutes = require('./routes/authRoute.js')
const categoryRoutes = require('./routes/categoryRoute.js')
const productRoutes = require('./routes/productRoute')
const cors = require('cors')
const path = require('path')

//config env
dotenv.config();

//db config
connectDB();
//rest object
const app = express();

//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname,'./client/build')))

//routes
app.use('/api/v1/auth',authRoutes)
app.use('/api/v1/category',categoryRoutes)
app.use('/api/v1/product',productRoutes)



//rest api
// app.get('/',(req,res)=>{
//   res.send('<h1>Welcome to ecommerce app</h1>')
// })
app.use('*',function(req,res){
  res.sendFile(path.join(__dirname,'./client/build/index.html'))
})

//port
const PORT = process.env.PORT || 8080;

//port listen
app.listen(PORT,()=>(
  console.log(`Server running on ${process.env.dev_mode} mode on ${PORT}`)
))