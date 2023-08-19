const mongoose = require('mongoose');

const app = require('./app')

const {DB_HOST} = process.env;

mongoose.connect(DB_HOST, {
  useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
})
    .then(() => {
      app.listen(3000)
      console.log("Database connect success")
    })
    .catch(error => {
      console.log(error.message);
      process.exit(1)
    })