const app = require('./app');


app.listen(app.get('port'));
console.log("El servidor está inicializado en el puerto ", app.get('port'));
