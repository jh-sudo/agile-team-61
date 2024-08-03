const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nimama',
  database: 'agile_database',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

const salt=5;
app.post("/signup", (req,res) =>{
  const sql =" INSERT INTO users (`username`, `email`,`password`) VALUES(?)";
  bcrypt.hash(req.body.password.toString(),salt,(err,hash)=>{
    if(err) return res.json("Error")
    const values =[req.body.username,req.body.email.hash]
    db.query(sql,[values],(err,result) =>{
      if(err) console.log(err);
      else return res.json(result)
    })
  
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
