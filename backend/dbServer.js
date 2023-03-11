const dotenv = require('dotenv');
const express = require('express');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const path = require('path');
const request = require('request');
require('dotenv/config');

const Users = require('./models/users');
const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', async (req, res) => {
  const { email, businessname, phone, password } = req.body;

  Users.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then(async (databaseUser) => {
      if (databaseUser) {
        return res.status(409).json({ message: 'email already exists' });
      } else if (req.body.email && req.body.password) {
        // password hash
        bcrypt.hash(password, 10).then((hash) => {
          Users.create({
            email: req.body.email,
            businessname: req.body.businessname,
            phone: req.body.phone,
            password: hash,
          })

            .then(async () => {
              // Create token
              const token = jwt.sign(
                { userId: req.body.userId, email: req.body.email },
                process.env.TOKEN_SECRET,
                {
                  expiresIn: '2h',
                }
              );
              // save user token
              Users.token = token;

              res
                .status(200)
                .json({
                  success: true,
                  message: 'user created',
                  data: { email, businessname, phone },
                });
            })
            .catch((err) => {
              console.log(err);
              res.status(502).json({ error: 'error while creating the user' });
            });
        });
      } else if (!req.body.password) {
        return res.status(400).json({ error: 'password not provided' });
      } else if (!req.body.email) {
        return res.status(400).json({ error: 'email not provided' });
      }
    })
    .catch((err) => {
      console.log('error', err);
    });
});   

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  Users.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((databaseUser) => {
      if (!databaseUser) {
        return res.status(404).json({ message: 'user not found' });
      } else {
        bcrypt.compare(req.body.password, databaseUser.password, (err, compareRes) => {
          if (err) {
            res.status(400).json({ error: 'error while checking user password' });
          } else if (compareRes) {
            const token = jwt.sign({ email: req.body.email }, process.env.TOKEN_SECRET, {
              expiresIn: '1h',
            });
            res.status(200).json({ message: 'user logged in', data: { email, token: token } });
          } else {
            res.status(400).json({ error: ' invalid credential' });
          }
        });
      }
    })
    .catch((err) => {
      console.log('error', err);
    });
});

const port = process.env.PORT;
app.listen(port, () => console.log(`Server Started on port ${port}...`));
