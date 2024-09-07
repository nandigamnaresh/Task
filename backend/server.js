const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());  
app.use(cors());          


mongoose.connect('mongodb://localhost:27017/scheduler', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});




const availabilitySchema = new mongoose.Schema({
  email: { type: String, required: true },
  availability: [{
    day: String,
    slots: [{
      start: Date,
      end: Date
    }]
  }]
});

const Availability = mongoose.model('Availability', availabilitySchema);


const sessionSchema = new mongoose.Schema({
  user: String,
  start: Date,
  end: Date,
  attendees: [{
    name: String,
    email: String
  }]
});

const Session = mongoose.model('Session', sessionSchema);


app.post('/api/availability', async (req, res) => {
  try {
    const { email, availability } = req.body;
    const existingUser = await Availability.findOne({ email });

    if (existingUser) {
      
      existingUser.availability = availability;
      await existingUser.save();
    } else {
      
      const newUser = new Availability({ email, availability });
      await newUser.save();
    }

    res.json({ message: 'Availability saved successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving availability', error });
  }
});


app.post('/api/schedule', async (req, res) => {
  try {
    const { user, start, end, attendees } = req.body;

    const newSession = new Session({
      user,
      start,
      end,
      attendees
    });

    await newSession.save();
    res.json({ message: 'Session scheduled successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling session', error });
  }
});


app.get('/api/sessions', async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sessions', error });
  }
});


const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
