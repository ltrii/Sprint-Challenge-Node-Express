const express = require('express');

const projectsRouter = require('./projects_router');
const actionsRouter = require('./actions_router');


const router = express.Router(); 

router.use('/projects', projectsRouter);
router.use('/actions', actionsRouter);

module.exports = router;