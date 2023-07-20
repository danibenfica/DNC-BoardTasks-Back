const mongoose = require('mongoose');
const handleExpectErrors = require('../functions/handleExpectErrors');

async function connectBD(req = null, res = null, next = null) {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Conectado ao banco de dados!');
        try { next(); } catch  { };
        return mongoose;
    } catch (error) {
        console.error(error)
        handleExpectErrors(res, 'Error:  Erro ao conectar ao banco de dados!')
        return error;
    }
}

module.exports = connectBD