var express = require('express');
//var express sebuah fungsion mengekspor objek dgn var app
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');

var app = express();
var port = 1997;

var db = mysql.createConnection({
    host: 'localhost',
    user: 'bigzero',
    password: '123456',
    database: 'popokpedia',
    port: 3306
})

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>Selamat datang!</h1>');

    //res adalah object, send adalah method (ada send, json, dll)

    // res.json({ nama: 'Big Zero' })
})

//untuk req.params.popokid
app.get('/popok/:id', (req,res) => {
    console.log(req.params.id)
    // res.send('<h1>Hey Cuy</h1>')
    res.send({id: parseInt(req.params.id)})
})

//untuk req.query --->> /popok?nama=
app.get('/popok', (req,res) => {
    var nama = req.query.nama;
    if(nama == undefined){
        nama = '';
    }
    var sql = `select * from product where nama like '%${nama}%';`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result)
        res.send(result)
    })
    
})

//latihan body parser
app.post('/popok', (req,res) => {

    var newPopok = {
        nama: req.body.nama,
        harga: req.body.harga,
        deskripsi: req.body.deskripsi,
        image: req.body.image,
        brandId: req.body.brandId
    }

    var nama = req.body.filterNama;

    var sql = 'insert into product set ? ;';
    db.query(sql, newPopok, (err, result) => {
        if(err) throw err;
        var sql = `select * from product where nama like '%${nama}%';`;
        db.query(sql, (err, result1) => {
            if(err) throw err;
            console.log(result1)
            res.send(result1)
        })   
    })
})

app.put('/popok/:id', (req,res) => {
    console.log(req.params.id)
    console.log(req.body)
    res.send('Put Sukses')
})

app.delete('/popok/:id', (req,res) => {
    console.log(req.params.id);
    var sql = `Delete from product where id = ${req.params.id}`;
    db.query(sql, (err,result) => {
        if(err) throw err;
        console.log(result);
        res.send('Delete Success')
    })
})

app.listen(port, () => console.log('API jalan di port ' +port));