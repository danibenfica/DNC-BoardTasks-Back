const express = require('express');
const authUser = require('../middlewares/authUser');
const EsquemaTarefa = require('../models/task');
const connectBD = require('../middlewares/connectBD');
const handleExpectErrors = require('../functions/handleExpectErrors');
const router = express.Router();

router.post('/criar', authUser, connectBD, async function (req, res) {
  try {
    let { posicao, titulo, descricao, status, dataEntrega } = req.body;
    const usuarioCriador = req.usuarioJwt.id;
    const respostaBD = await EsquemaTarefa.create({ posicao, titulo, descricao, status, dataEntrega, usuarioCriador });

    res.status(200).json({
      status: "OK",
      statusMensagem: "Tarefa criada com sucesso!",
      resposta: respostaBD
    })

  } catch (error) {
    return handleExpectErrors(res, error);
  }
});

module.exports = router;
