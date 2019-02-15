const express = require('express');

const db = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let actions = await db.get();
        res.status(200).json(actions);
    } catch(error) {
        res.status(500).json({error: "The actions information could not be retrieved."});
    }
});

router.get('/:id', async (req, res) => {
    try {
        const post = await db.getById(req.params.id);
        if(post.length > 0) {
            res.status(200).json(post);
        } else {
            res.status(404).json({message: "The action with the specified ID does not exist."})
        }
        
    } catch(error) {
        res.status(500).json({error: "The action information could not be retrieved."})
    }
});

router.post('/', async (req, res) => {
    if(!req.body.project_id) {
        res.status(400).json({error: "Please provide a project ID for the action."});
        return;
    }
    if(!req.body.description) {
        res.status(400).json({error: "Please provide a description for the action."});
        return;
    }
    if(req.body.description.length > 128) {
        res.status(400).json({error: "Description must be less that 128 chars"});
        return;
    }
    if(!req.body.notes) {
        res.status(400).json({error: "Please provide notes for the action."});
        return;
    }
    try {
        const newaction = {
            project_id: req.body.project_id,
            description: req.body.description,
            notes: req.body.notes
        };
        let insaction = await db.insert(newaction);
        let theaction = await db.getById(insaction.id);
        res.status(201).json(theaction);
    } catch(error) {
        res.status(500).json({error: "Added"});
    }
});

router.delete('/:id', async (req, res) => {
    try {
      const count = await db.remove(req.params.id);
      if (count > 0) {
        res.status(200).json({ message: 'The action has been nuked' });
      } else {
        res.status(404).json({ message: 'The action could not be found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Error removing the action',
      });
    }
});

router.get('/:id/posts', async (req, res) => {
    try {
        let posts = await db.getactionPosts(req.params.id);
        if(posts.length) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({error: true, message: "No posts found for this action"});
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({error: true, message: "We are unable to find any posts at this time."})
    }
});

router.put('/:id', async (req, res) => {
    if(!req.body.name) {
        res.status(400).json({error: "The action must have a name"});
        return;
    }
    
    try {
      const action = await db.update(req.params.id, req.body);
      if (action) {
        res.status(200).json(action);
      } else {
        res.status(404).json({ message: 'The action could not be found' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: 'Error updating the action',
      });
    }
});


module.exports = router;