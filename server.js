const express = require('express'); 

const mainRouter = require('./routers/routes');

const server = express();

server.use(express.json());

server.use('/api/', mainRouter);

server.get('/', async (req, res) => {
  res.send(`
    <h2>Sprint</h>
  `);
});

module.exports = server;