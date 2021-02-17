const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const users = require("./api/routes/user.js");
app.use('/api/v1', users());

