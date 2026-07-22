const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['https://register.medinitechnologies.in/', 'https://register.medinitechnologies.in','https://course-register-xi.vercel.app/'],
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/registrationDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Registration Schema
const registrationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  highestQualification: {
    type: String,
    required: true
  },
  yearOfPassing: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Registration = mongoose.model('Registration', registrationSchema);

// Routes

// POST - Create new registration
app.post('/api/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, highestQualification, yearOfPassing, message } = req.body;
    
    const newRegistration = new Registration({
      firstName,
      lastName,
      email,
      phoneNumber,
      highestQualification,
      yearOfPassing,
      message
    });

    const savedRegistration = await newRegistration.save();
    res.status(201).json(savedRegistration);
  } catch (error) {
    console.error('Error saving registration:', error);
    res.status(500).json({ error: 'Error saving registration' });
  }
});

// GET - Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    res.status(500).json({ error: 'Error fetching registrations' });
  }
});

// DELETE - Delete a registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    const deletedRegistration = await Registration.findByIdAndDelete(req.params.id);
    if (!deletedRegistration) {
      return res.status(404).json({ error: 'Registration not found' });
    }
    res.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    console.error('Error deleting registration:', error);
    res.status(500).json({ error: 'Error deleting registration' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
