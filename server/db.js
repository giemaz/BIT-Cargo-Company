// server/db.js
const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'cargo',
});

connection.connect((err) => {
	if (err) {
		console.error('Error connecting to the MySQL database:', err.stack);
		return;
	}
	console.log('Connected to the MySQL database as id:', connection.threadId);
});

module.exports = connection;
