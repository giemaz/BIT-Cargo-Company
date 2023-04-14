// server\app.js
const express = require('express');
const path = require('path');
const { authenticateJWT } = require('./utils/middleware');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
const port = 3003;

const authRoutes = require('./routes/authRoutes');
const containersRoutes = require('./routes/containersRoutes');
const boxesRoutes = require('./routes/boxesRoutes');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(authRoutes);
app.use(boxesRoutes(authenticateJWT));
app.use(containersRoutes(authenticateJWT));

app.listen(port, () => {
	console.log(`LN is on port number: ${port}`);
});

module.exports = { authenticateJWT };
