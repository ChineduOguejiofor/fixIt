const express = require('express');
const app = express();

app.use(express.json({ extended: false })); // body parser

app.get('/', (req, res) => res.send('API is running'));

// Defining routes
app.use('/api/users', require('./routes/api/v1/users'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
