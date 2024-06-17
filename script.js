const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (Assuming local instance for simplicity)
mongoose.connect('mongodb://localhost:27017/qna_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define MongoDB Schema and Models (Question and Answer)

const questionSchema = new mongoose.Schema({
  sectionId: String,
  text: String,
  image: String,
  answers: [{
    text: String,
    image: String,
    starRating: Number,
  }],
});

const Question = mongoose.model('Question', questionSchema);

// API Endpoints

// Get all questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a question
app.post('/api/questions', async (req, res) => {
  const question = new Question({
    sectionId: req.body.sectionId,
    text: req.body.text,
    image: req.body.image,
    answers: [],
  });

  try {
    const newQuestion = await question.save();
    res.status(201).json(newQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a question
app.delete('/api/questions/:id', async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted question' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Other endpoints for answers, ratings, etc.

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server started on port ${port}`));
