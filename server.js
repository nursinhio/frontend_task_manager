const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/verify', (req, res) => {
    res.sendFile(path.join(__dirname , 'public','verify.html'));
});

app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname , 'public','main.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname , 'public','admin.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname , 'public','user.html'));
});

app.get('/create-task', (req, res) => {
    res.sendFile(path.join(__dirname , 'public','create-task.html'));
});

app.get('/tasks', (req, res) => {
    res.sendFile(path.join(__dirname , 'public','tasks.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
});
