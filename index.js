// This is the main server file

const express = require("express");
const app = express();

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

// Middleware to parse JSON body
app.use(express.json());

// HTTP GET request to /
app.get("/", (req, res) => {
  res.send(`<h1>Welcome to the notes server!</h1>
    <p>This is a simple server that serves notes to the client.</p>
    <p>You can create a new note by sending a POST request to /api/notes.</p>
    <p>You can get all the notes by sending a GET request to /api/notes.</p>
    <p>You can also get a specific note by sending a GET request to /api/notes/:id.</p>
    <p>For example, to get the note with id 1, you can send a GET request to /api/notes/1.</p>
    <p>To get all the notes, you can send a GET request to /api/notes.</p>
    <p>To create a new note, you can send a POST request to /api/notes with the following body:</p>
    <pre>
    {
        "content": "This is a new note",
        "important": true
    }
    </pre>

    <button onclick="window.location.href='/api/notes'">Get all notes</button>
    <button onclick="window.location.href='/api/notes/1'">Get note with id 1</button>
    <button onclick="window.location.href='/api/notes/3'">Delete note with id 3</button>
  `);
});

// HTTP GET request to /api/notes
app.get("/api/notes", (req, res) => {
  res.json(notes);
});

// HTTP GET request to /api/notes/:id
app.get("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.statusMessage = "Note not found";
    res.status(404).end();
  }
});

// HTTP DELETE request
app.delete("/api/notes/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    res.status(202).end();
  } else {
    res.statusMessage = "Note not found";
    res.status(404).end();
  }
});

// Helper function to generate a unique id for a note
const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

// HTTP POST request to /api/notes
app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(400).json({ error: "Content is required" });
  }

  const note = {
    id: generateId(),
    content: body.content,
    important: Boolean(body.important) || false,
  };

  notes = notes.concat(note);
  res.status(201).json(note);
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
