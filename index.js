var express = require('express')
var cors = require('cors')
const mysql = require('mysql2');
const fs = require('fs');


const connection = mysql.createConnection({
  host: 'nextsoftwarethailand.com',
  user: 'nextsoft_dev_01',
password:'nextsoft1234',
  database: 'nextsoft_dev_01'
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

app.listen(process.env.PORT || 5000, function () {
  console.log('SERVER RUN port 5000')
})