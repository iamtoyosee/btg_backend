const express = require('express')
const globalErrorHandler = require('./controllers/errorController')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const commentRoutes = require('./routes/commentRoutes')
const AppError = require('./utils/AppError')
const cors = require('cors');
const multer = require('multer');


const uploadMiddleWare = multer({dest: './uploads/'});

const app = express()
//express.json allows incoming request to be parsed before it gets processed by our server
app.use(express.json())
//the cors library helps us avoid cors error by ensuring appropriate cors header are added to our request headers
app.use(
  cors({
    allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
    exposedHeaders: ["authorization"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
)




app.use('/auth', userRoutes)
app.use('/post', uploadMiddleWare.single('file'), postRoutes)
app.use('/comment', commentRoutes)
app.use('/uploads', express.static(__dirname + '/uploads'))


app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

app.use(globalErrorHandler)

module.exports = app;