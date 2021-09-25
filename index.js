const express = require('express');
const graphqlHTTP = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');
const mongoose = require("mongoose");
const auth = require('./utils/auth')

mongoose.connect('mongodb://localhost/coursedb',{
    useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(() => console.log("Conectado a MongoDB correctamente"))
    .catch(() => console.error("No se pudo conectar la DB MongoDB"));


const app = express();


app.use(auth.checkHeaders);


app.use('/graphql', graphqlHTTP((req) => {
    return {
        schema,
        graphiql:true,
        context: {
            user: req.user
        }
    } 
}));

const port = 3131;

app.listen(port, ()=> {
    console.log('Listen port ', port)
})