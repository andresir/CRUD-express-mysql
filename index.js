var express = require('express');
//var express sebuah fungsion mengekspor objek dgn var app
var bodyParser = require('body-parser');
var cors = require('cors');
var mysql = require('mysql');

var app = express();
var port = 1997;

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '212',
    database: 'moviebertasbih',
    port: 3306
})


// ##################################################################################
// JAWABAN HOME PAGE ----------------------------------------------------------------

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>Selamat datang! Ini Home Page</h1>\n\n');
})


// ##################################################################################
// JAWABAN MANAGE MOVIES ------------------------------------------------------------
// GET MOVIES --------------------------------------------------------------------
app.get('/listmovies', (req,res) => {
    var sql = `select * from movies;`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result)
        res.send(result)
    })
})

//POST MOVIES
// --------------------------------------------------------------------------------
app.post('/postmovies', (req,res) => {

    var newMovies = {
        nama: req.body.nama,
        tahun: req.body.tahun,
        description: req.body.description
    }
    // var nama = req.body.filterNama;
    var sql = 'insert into movies set ? ;';
    db.query(sql, newMovies, (err, result) => {
        if(err) throw err;
        var sql = `select * from movies;`;
        db.query(sql, (err, result1) => {
            if(err) throw err;
            console.log(result1)
            res.send(result1)
        })   
    })
})
// -------------------------------------------------------------------------------

// EDIT List Movies ---------------------------------------------------------------
app.put('/editmovies/:id', function(req,res){
    var editMovies = {
        nama: req.body.nama,
        tahun: req.body.tahun,
        description: req.body.description
    }
    sql = `UPDATE movies SET ? WHERE id=${req.params.id}`
    db.query(sql, editMovies, (err,results)=>{
        if(err) throw err;
        console.log(results)
        // res.send({status:"Update category success", id: req.params.id, updatedRows:results.changedRows})
        res.send({status:"Update movies success", results})
    })
})
//---------------------------------------------------------------------------------

//DELETE Movies -------------------------------------------------------------------
app.delete('/delmovies/:id', (req,res) => {
    // console.log(req.params.id);
    var sql = `Delete from movies where id = ${req.params.id}`;
    db.query(sql, (err,result) => {
        if(err) throw err;
        // console.log(result);
        res.send('Delete Success', result)
    })
})
// --------------------------------------------------------------------------------




// ##################################################################################
// JAWABAN MANAGE CATEGORY -------------------------------------------------------
// GET CATEGORY --------------------------------------------------------------------
app.get('/listcategory', (req,res) => {
    var sql = `select * from categories;`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result)
        res.send(result)
    })
})

//POST CATEGORY
// --------------------------------------------------------------------------------
app.post('/postcategory', (req,res) => {

    var newCategory = {
        nama: req.body.nama,
    }
    // var nama = req.body.filterNama;
    var sql = 'insert into categories set ? ;';
    db.query(sql, newCategory, (err, result) => {
        if(err) throw err;
        var sql = `select * from categories;`;
        db.query(sql, (err, result1) => {
            if(err) throw err;
            console.log(result1)
            res.send(result1)
        })   
    })
})
// -------------------------------------------------------------------------------

// EDIT List CATEGORY ---------------------------------------------------------------
app.put('/editcategory/:id', function(req,res){
    var editCategory = {
        nama: req.body.nama
    }
    sql = `UPDATE categories SET ? WHERE id=${req.params.id}`
    db.query(sql, editCategory, (err,results)=>{
        if(err) throw err;
        console.log(results)
        // res.send({status:"Update category success", id: req.params.id, updatedRows:results.changedRows})
        res.send({status:"Update category success", results})
    })
})
//---------------------------------------------------------------------------------

//DELETE CATEGORY -------------------------------------------------------------------
app.delete('/delcategory/:id', (req,res) => {
    // console.log(req.params.id);
    var sql = `Delete from categories where id = ${req.params.id}`;
    db.query(sql, (err,result) => {
        if(err) throw err;
        // console.log(result);
        res.send('Delete Category Success', result)
    })
})
// --------------------------------------------------------------------------------



// ##################################################################################
// JAWABAN Connect Movies & Category ------------------------------------------------


//==========================================================================================================================================
// MAAF MAS BARON, TABEL 'MOVCAT' nya saya lupa klo ada,, tabel movcat disini saya ganti nama 'join_kategori_film' (id, idMovie, idCategory)
//==========================================================================================================================================

//ADD CATEGORIES ------------------------------------------------------------------
app.post('/addcategory', (req,res) => {
    var { nama_movies, nama_category } = req.body;

    var sql =   `INSERT INTO join_kategori_film VALUES
                (null, (SELECT id FROM movies WHERE nama LIKE '%${nama_movies}%'), 
                (SELECT id FROM categories WHERE nama LIKE '%${nama_category}%'));`;
    
    db.query(sql, (err, result) => {

        if(err) throw err;
        var sql = `select * from join_kategori_film;`;
        db.query(sql, (err, result1) => {
            if(err) throw err;
            console.log(result1)
            res.send(result1)
        })   
        // res.send(`Film ${nama_movies} Berhasil Ditambahkan Ke Kategori ${nama_category}`);
    })
})

//DEL MOVIES CATEGORY----------------------------------------------------------------------------------
app.delete('/delmoviecat', (req,res) => {
    var { nama_movies, nama_category } = req.body;

    var sql =   `DELETE join_kategori_film FROM join_kategori_film
                JOIN categories ON join_kategori_film.idCategory = categories.id
                JOIN movies ON join_kategori_film.idMovie = movies.id
                WHERE (movies.nama LIKE '%${nama_movies}%') AND (categories.nama LIKE '%${nama_category}%');`;
    db.query(sql, (err, result) => {
        if(err) throw err;
        // console.log(`Film ${nama_movies} Berhasil Dihapus Dari Kategori ${nama_category}`);
        res.send(`Film ${nama_movies} Berhasil Dihapus Dari Kategori ${nama_category}`);
    })
})

app.listen(port, () => console.log('API jalan di port ' +port));