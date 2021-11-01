const express = require('express');
const connectDB = require('./config/db');
const defaultAdmin = require('./config/defaultAdmin');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

//Define Routes
app.use('/api/offices', require('./routes/api/offices'));
app.use('/api/meeting', require('./routes/api/meeting'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/adminauth', require('./routes/api/adminauth'));
app.use('/api/officeprofile', require('./routes/api/officeprofile'));
app.use('/api/rooms', require('./routes/api/rooms'));
app.use('/api/admins', require('./routes/api/admins'));
app.use('/api/meetingauth', require('./routes/api/meetingauth'));

const PORT = process.env.PORT || 5000;

//check for default admin
defaultAdmin();

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
