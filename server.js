//Allows us to load environmental variables
const dotenv = require("dotenv");
//We are importing the mongoose library
const mongoose = require("mongoose");

//This states the .env path
dotenv.config({ path: "./.env" });

//This imports the app file from ./app
const app = require("./app");

//This connects our mongoose database using the DATABASE 
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected"));

const server = app.listen(8080, () => {
  console.log("App is running on port 8080");
});

//This sets up an event listener for the "unhandledException" error event.
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled promise rejection.... Shutting down !!!!");
  server.close(() => {
    process.exit(1);
  });
});
