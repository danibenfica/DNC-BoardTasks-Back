const express = require('express');
const connectBD = require('../middlewares/connectBD');
const handleExpectErrors = require('../functions/handleExpectErrors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const EsquemaUsuario = require('../models/user');
const router = express.Router();

router.post('/criar', connectBD, async function(req, res) {
  try {
    // #swagger.tags = ['Usuario']
    let {nome, email, senha} = req.body;
    const numeroVezesHash = 10;
    const senhaHash = await bcrypt.hash(senha, numeroVezesHash);
    const respostaBD = await EsquemaUsuario.create({nome, email, senha: senhaHash});

    res.status(200).json({
      status: "OK",
      statusMensagem: "Usuário criado com sucesso!",
      resposta: respostaBD

    })

  } catch (error) {
    if(String(error).includes("email_1 dup key")){
      return handleExpectErrors(res, "Error: Já existe uma conta com esse e-mail!")
    }
    return handleExpectErrors(res, error);
  }
});

router.post('/logar', connectBD, async function(req, res) {
  try {
    // #swagger.tags = ['Usuario']
    let {email, senha} = req.body;

    let respostaBD = await EsquemaUsuario.findOne({ email }).select('+senha');
    if(respostaBD) {
      let senhaCorreta = await bcrypt.compare(senha, respostaBD.senha);
      if(senhaCorreta) {

        let token = jwt.sign({ id: respostaBD._id }, process.env.JWT_SECRET, { expiresIn: "10d" })

        res.header('x-auth-token', token);
        res.status(200).json({
          status: "OK!",
          statusMensagem: "Usuário autenticado com sucesso!",
          resposta: { "x-auth-token": token }
        });
      } else {
        throw new Error("E-mail ou senha incorreta!")
      }
    } else {
      throw new Error("E-mail ou senha incorreta!")
    }

  } catch (err) {
    return handleExpectErrors(res, err);
  }

});

module.exports = router;
