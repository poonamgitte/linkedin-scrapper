// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Profile = require('./models/Profile');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
// mongoose.connect('mongodb://localhost/linkedin_profiles', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/linkedin_profiles');
}

//POST API to receive LinkedIn profile data
app.post('/api/profile', async (req, res) => {
  //const { name, url, about, bio, location, followerCount, connectionCount } = req.body;
  const profileData = req.body;

  console.log(req.body);
  // const profile = new Profile({
  //   name: name,
  //   url: url,
  //   about:about,
  //   boi: bio,
  //   location: location,
  //   followerCount: followerCount,
  //   connectionCount: connectionCount,
  // });

  const newProfile = new Profile({
    name: profileData.name,
    url: profileData.url,
    about: profileData.about,
    bio: profileData.bio,
    location: profileData.location,
    followerCount: profileData.followerCount,
    connectionCount: profileData.connectionCount
});


  await newProfile.save();
  res.status(201).send({ message: 'Profile saved successfully!' });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

