const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

var fetchuser = require("../middleware/fetchuser");
const Note = require("../models/Note");

// Route 1 Get all notes

router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error occured");
  }
});
// Route 2 Add notes

router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "enter a valid title").isLength({ min: 3 }),
    body(
      "description",
      " description should be atleast 5 characters "
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //   if errors return bad req
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const note = new Note({
        title,
        description,
        tag,
        user: req.id,
      });

      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

// Route 3 upating  notes
router.put(
  "/updatenote/:id",
  fetchuser,

  async (req, res) => {
    const { title, description, tag } = req.body;
    try {
      //  create new note object
      const newNote = {};
      if (title) {
        newNote.title = title;
      }
      if (description) {
        newNote.description = description;
      }
      if (tag) {
        newNote.tag = tag;
      }
      // Find the note to be updated

      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("not found");
      }
      if ((await note).user.toString() !== req.id) {
        return res.status(401).send("not allowed");
      }

      note = await Note.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
      );
      res.json({ note });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

//  Route 4 delete the note

router.delete(
  "/deletenote/:id",
  fetchuser,

  async (req, res) => {
    try {
      // Find the note to be updated

      let note = await Note.findById(req.params.id);
      if (!note) {
        return res.status(404).send("not found");
      }

      //  Allow only Authorize user
      if ((await note).user.toString() !== req.id) {
        return res.status(401).send("not allowed");
      }

      note = await Note.findByIdAndDelete(req.params.id);
      res.json({ Success: "Note has been deleted ", note: note });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server error occured");
    }
  }
);

module.exports = router;
