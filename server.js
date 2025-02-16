const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', err => {
  console.log('Uncaught Exception  Shutting down');
  console.log(err.message, err);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);



const port = process.env.PORT || 3000;
const server = app.listen(port, '127.0.0.1', () => {
  console.log('Server is running on http://127.0.0.1:3000');
});


console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('DB connection successful!'));
process.on('unhandledRejection', err => {
  console.log('Unhandled REJECTION  Shutting down');
  console.log(err.message, err.name);
  server.close(() => {
    process.exit(1);
  });
});
