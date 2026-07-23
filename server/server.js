const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://register.medinitechnologies.in',
    'https://register.medinitechnologies.in/',
    'https://course-register-xi.vercel.app',
    'https://course-register-xi.vercel.app/',
    'http://localhost:3000',
    'http://localhost:3001'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/registrationDB';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  console.log('Database URI:', mongoURI);
  
  // Test connection by checking if database is accessible
  mongoose.connection.db.listCollections().toArray((err, collections) => {
    if (err) {
      console.error('Error listing collections:', err);
    } else {
      console.log('Available collections:', collections.map(c => c.name));
    }
  });
})
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

// Email Configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'support@medinitechnologies.in',
    pass: process.env.EMAIL_PASS
  }
});

// SMS Configuration
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send confirmation email to submitter
const sendConfirmationEmail = async (data) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'support@medinitechnologies.in',
      to: data.email,
      subject: 'Thank You for Reaching Out - Medini Technologies',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">Medini Technologies</h2>
          </div>
          <div style="padding: 30px 20px; background-color: #f8f8f8;">
            <h3 style="color: #000;">Thank You for Reaching Out!</h3>
            <p style="color: #333; line-height: 1.6;">Dear ${data.firstName} ${data.lastName},</p>
            <p style="color: #333; line-height: 1.6;">Thank you for your interest in Medini Technologies. We have received your enquiry and our team will contact you soon.</p>
            <p style="color: #333; line-height: 1.6;"><strong>Your Details:</strong></p>
            <ul style="color: #333; line-height: 1.6;">
              <li>Name: ${data.firstName} ${data.lastName}</li>
              <li>Email: ${data.email}</li>
              <li>Phone: ${data.phoneNumber}</li>
              <li>Qualification: ${data.highestQualification}</li>
              <li>Year of Passing: ${data.yearOfPassing}</li>
            </ul>
            <p style="color: #333; line-height: 1.6;">If you have any urgent questions, please feel free to contact us at support@medinitechnologies.in or call us at +91 96863 11005.</p>
            <p style="color: #333; line-height: 1.6;">Best regards,<br>Medini Technologies Team</p>
          </div>
          <div style="background-color: #000; padding: 15px; text-align: center;">
            <p style="color: white; margin: 0; font-size: 12px;">© 2024 Medini Technologies. All rights reserved.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', data.email);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Send registration data to admin team
const sendAdminEmail = async (data) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'support@medinitechnologies.in',
      to: process.env.ADMIN_EMAIL || 'support@medinitechnologies.in',
      subject: 'New Registration Enquiry - Medini Technologies',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #000; padding: 20px; text-align: center;">
            <h2 style="color: white; margin: 0;">New Registration Enquiry</h2>
          </div>
          <div style="padding: 30px 20px; background-color: #f8f8f8;">
            <h3 style="color: #000;">Student Registration Details</h3>
            <p style="color: #333; line-height: 1.6;">A new student has registered for enquiry. Here are the details:</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="background-color: #000; color: white;">
                <th style="padding: 10px; text-align: left;">Field</th>
                <th style="padding: 10px; text-align: left;">Details</th>
              </tr>
              <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>First Name:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.firstName}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Last Name:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.lastName}</td>
              </tr>
              <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.email}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Phone:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.phoneNumber}</td>
              </tr>
              <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Qualification:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.highestQualification}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Year of Passing:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.yearOfPassing}</td>
              </tr>
              <tr style="background-color: white;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Message:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${data.message || 'N/A'}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Registered On:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
            <p style="color: #333; line-height: 1.6; margin-top: 20px;">Please follow up with the student at the earliest.</p>
          </div>
        </div>
      `
    };
    await transporter.sendMail(mailOptions);
    console.log('Admin email sent successfully');
  } catch (error) {
    console.error('Error sending admin email:', error);
  }
};

// Send SMS notification
const sendSMSNotification = async (data) => {
  try {
    const adminPhone = process.env.ADMIN_PHONE || '+919686311005';
    const message = `New Registration: ${data.firstName} ${data.lastName}, ${data.email}, ${data.phoneNumber}, ${data.highestQualification}, ${data.yearOfPassing}. Enquiry received at Medini Technologies.`;
    
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: adminPhone
    });
    console.log('SMS notification sent to:', adminPhone);
  } catch (error) {
    console.error('Error sending SMS:', error);
  }
};

// Routes

// POST - Create new registration
app.post('/api/register', async (req, res) => {
  try {
    console.log('POST /api/register - Received request body:', req.body);
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
    console.log('Registration saved successfully:', savedRegistration);

    // Send notifications asynchronously (don't block response)
    // Send confirmation email to submitter
    sendConfirmationEmail({
      firstName,
      lastName,
      email,
      phoneNumber,
      highestQualification,
      yearOfPassing
    }).catch(err => console.error('Confirmation email failed:', err));

    // Send registration data to admin team
    sendAdminEmail({
      firstName,
      lastName,
      email,
      phoneNumber,
      highestQualification,
      yearOfPassing,
      message
    }).catch(err => console.error('Admin email failed:', err));

    // Send SMS notification to admin
    sendSMSNotification({
      firstName,
      lastName,
      email,
      phoneNumber,
      highestQualification,
      yearOfPassing
    }).catch(err => console.error('SMS notification failed:', err));

    res.status(201).json(savedRegistration);
  } catch (error) {
    console.error('Error saving registration:', error);
    console.error('Error details:', error.message);
    console.error('Error code:', error.code);
    if (error.code === 11000) {
      console.error('Duplicate key error - email already exists');
      res.status(400).json({ error: 'Email already registered' });
    } else {
      res.status(500).json({ error: 'Error saving registration', details: error.message });
    }
  }
});

// GET - Get all registrations
app.get('/api/registrations', async (req, res) => {
  try {
    console.log('GET /api/registrations - Fetching all registrations');
    const registrations = await Registration.find().sort({ createdAt: -1 });
    console.log('Found registrations:', registrations.length);
    console.log('Registrations data:', JSON.stringify(registrations, null, 2));
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
