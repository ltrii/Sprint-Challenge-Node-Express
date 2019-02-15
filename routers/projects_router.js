const express = require('express');

const db = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let projects = await db.get();
        res.status(200).json(projects);
    } catch(error) {
        res.status(500).json({error: "The projects information could not be retrieved."});
    }
});

router.post('/', async (req, res) => {
    if(!req.body.name || !req.body.description) {
        res.status(400).json({error: "Please provide a name and description for the project."});
        return;
    }

    try {
        const projectFull = {
            text: req.body.text,
            user_id: req.body.user_id
        };
        let newId = await db.insert(projectFull);
        let newproject = await db.getById(newId.id);
        res.status(201).json(newproject);
    } catch(error) {
        res.status(500).json({error: "There was an error while saving the project to the database"});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const project = await db.getById(req.params.id);
        if(project) {
            res.status(200).json(project);
        } else {
            res.status(404).json({message: "The project with the specified ID does not exist."})
        }
        
    } catch(error) {
        res.status(500).json({error: "The project information could not be retrieved."})
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const count = await db.remove(req.params.id);
      if (count > 0) {
        res.status(200).json({ message: 'The project has been nuked' });
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Error removing the project',
      });
    }
});

router.put('/:id', async (req, res) => {
    if(!req.body.text) {
        res.status(400).json({error: "Please provide text for the project."});
        return;
    }
    
    try {
      const project = await db.update(req.params.id, req.body);
      if (project) {
        res.status(200).json(project);
      } else {
        res.status(404).json({ message: 'The project could not be found' });
      }
    } catch (error) {
      // log error to database
      console.log(error);
      res.status(500).json({
        message: 'Error updating the project',
      });
    }
});


module.exports = router;