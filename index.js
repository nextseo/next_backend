var express = require('express')
var cors = require('cors')
const mysql = require('mysql2');
const fs = require('fs');
require("dotenv").config()


const connection = mysql.createConnection({
  host: process.env.HOST_HOSTNAME,
  user: process.env.HOST_USERNAME,
password:process.env.HOST_PASSWORD,
  database: process.env.HOST_DATABASE
});

var app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'));
app.use('/images', express.static('images'));


app.get('/api', async (req,res)=>{
try {
    await connection.query(`SELECT * FROM lp`, (err,data, fielsd)=>{
        for (const result of data) {
            
            const { idx, lp_image } = result;
            const base64Data = lp_image.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const filename = `image_${idx}.png`; 
            const outputPath = './images'
            const filePath = `${outputPath}/${filename}`; 

             connection.execute('UPDATE  lp SET image = ? WHERE idx = ?', [filename, idx]);

            fs.writeFileSync(filePath, buffer);
            console.log(`Image ${filename} saved.`);

            
        }

        res.json(data)
    })
} catch (error) {
    console.log(error);
}
})

app.get('/test', (req,res)=>{

  res.send('Hello test')
})

app.listen(process.env.PORT || 5000, function () {
  console.log('SERVER RUN port 5000')
})