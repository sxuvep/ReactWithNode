const express = require('express');

const app = express();

//route handler in express
app.get('/', (req, res) => {
	res.send({ hi: 'hello there' });
});

//heroku will inject port into environment variable

const PORT = process.env.PORT || 5000;

app.listen(PORT);
