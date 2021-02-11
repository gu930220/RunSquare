require('./models/User');
require('./models/Track');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth')

const app = express();

app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

//mongodb connect
const mongoUri = 'mongodb+srv://admin:992qas@cluster0.ow1dk.mongodb.net/<dbname>?retryWrites=true&w=majority'
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true
});
//connect 성공시 콜백함수 호출
mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});
//error시 콜백함수 호출
mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err);
});

app.get('/', requireAuth, (req, res) => {
    res.send(`Your email: ${req.user.email}`);
});

app.listen(3000, () => {
    console.log('Listening on port 3000')
});