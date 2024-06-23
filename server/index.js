const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const cookieParser = require('cookie-parser');
const db = require('./models'); 


const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
};

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));   
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public'))); 
// Routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const postRoutes = require('./routes/post');
app.use('/posts', postRoutes);

const commentRoutes = require('./routes/comment');
app.use('/comments', commentRoutes);

const userRoutes = require('./routes/user')
app.use('/user', userRoutes);

const PORT = process.env.PORT || 5502;


db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Listening to port ${PORT}`);
    })
})