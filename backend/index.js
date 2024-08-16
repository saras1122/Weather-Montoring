const express = require('express');
const bodyParser = require('body-parser');
const { connectDB, disconnectDB } = require('./db');
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'ABCDEFRYFSB'; // Replace with your own secret key

// Initialize Express
const app = express();
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend's URL
    credentials: true,               // This allows cookies to be sent
}));
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json()); // To parse JSON bodies

// Connect to MongoDB when the server starts
connectDB();

app.post('/api/users', async (req, res) => {
    try {
        const { date, summary1, city } = req.body;
        const newUser = new User({
            date,
            summary1,
            city
        });
        console.log(newUser)
        const result = await newUser.save();
        console.log(1, result)
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Generate a token
        const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1h' });
        
        // Set the token in a cookie
        res.cookie('authToken', token, { httpOnly: true, secure: true });
        
        res.status(200).json({ success: true, message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Middleware to check authentication
app.use((req, res, next) => {
    const token = req.cookies.authToken;
    
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) return res.status(401).json({ error: 'Unauthorized' });
            req.user = decoded;
            next();
        });
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
});
app.get('/api/protected', (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
