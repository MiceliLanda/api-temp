//const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("../../api-as1-firebase-adminsdk-pdsa6-fcc463fdc3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://api-as1.firebaseio.com/'
});

const db = admin.database();

const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');

router.get('/temperatura-usuario', (req, res) =>{
  
    const promise1 =  new Promise ((resolve, reject) => {
        db.ref('usuario').once('value', (snapshot) =>{
            const data = snapshot.val();
            resolve(data);
        }).catch(error => {
            reject(error)
        });
    });    

    const promise2 =  new Promise ((resolve, reject) => {
        db.ref('newhistorial').once('value', (snapshot) =>{
            const data = snapshot.val();
            valores = Object.values(snapshot.val());
            datos = valores[valores.length-1].temp;
            resolve(data);
        }).catch(error => {
            reject(error);
        }); 
    });   

    const promise3 =  new Promise ((resolve, reject) => {
        db.ref('date').once('value', (snapshot) =>{
            const data = snapshot.val();
            resolve(data);
        }).catch(error => {
            reject(error);
        }); 
    });   

    const promise4 =  new Promise ((resolve, reject) => {
        db.ref('hour').once('value', (snapshot) =>{
            const data = snapshot.val();
            resolve(data);
        }).catch(error => {
            reject(error);
        }); 
    });   

    Promise.all([promise1, promise2 , promise3 ,promise4]).then(results => {
        if (results [0] && results[1] && results[2] && results[3]){
            res.render('temperatura', {usuario : results[0], newhistorial: results [1], datos , date : results[2], hour : results[3]})
        } 
    });
});

router.post('/new-usuario', (req,res)=>{
    console.log(req.body);
    const newUsuario = {
        nombre: req.body.nombre,
        correo: req.body.correo, 
        edad: req.body.edad,
        genero: req.body.genero, 
    }
    db.ref('usuario').push(newUsuario);
    res.redirect('/temperatura-usuario');
});


router.post('/temperatura-usuario', (req,res)=>{
    //res.render('temperatura');
    res.render('temperatura');
});

router.get('/', (req, res) => {
    res.render('index');
});


router.post('/new-historial', (req,res)=>{
    console.log(req.body);
    const newHistorial = {
        hora: req.body.hora,
        temperatura: req.body.temperatura
    };
    db.ref('historial').push(newHistorial);
    res.redirect('/');
});

router.get('/delete-usuario/:id', (req, res) => {
    db.ref('usuario/' + req.params.id).remove();
    db.ref('newhistorial').remove();
    db.ref('date').remove();
    db.ref('hour').remove();
    res.redirect('/');
});

router.get('/delete-historial/:id', (req, res) => {
    db.ref('newhistorial/' + req.params.id).remove();
    res.redirect('/');
});


module.exports = router;