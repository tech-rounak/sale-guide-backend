const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const cron = require('node-cron');

connectDB();
dotenv.config();

const { discountChecker } = require('./controllers/subscription.controller')
cron.schedule('* 1 * * * *', async() => {
    console.log('node-cron running');
    await discountChecker()
});
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors());


app.use('/subscribe',require('./routes/subscription'));

app.get("/", (req, res) => {
  res.send("Sale Guide server up and running");
});

app.listen(8080, () => {
  console.log(`Server is running on PORT:8080`);
});


