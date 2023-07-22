const express = require('express');
const handleExpectErrors = require('../functions/handleExpectErrors.js');
const authUser = require('../middlewares/authUser.js');
const connectBD = require('../middlewares/connectBD.js');
const EsquemaTarefa = require('../models/task.js');
const router = express.Router();


router.post('/criar', authUser, connectBD, async function (req, res) {
  try {
    // #swagger.tags = ['Tarefa']
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


router.put('/editar/:id', authUser, connectBD, async function (req, res) {
  try {
    // #swagger.tags = ['Tarefa']
    let idTarefa = req.params.id;
    let { posicao, titulo, descricao, status, dataEntrega } = req.body;
    const usuarioLogado = req.usuarioJwt.id;

    const checkTarefa = await EsquemaTarefa.findOne({ _id: idTarefa, usuarioCriador: usuarioLogado });
    if (!checkTarefa) {
      throw new Error("Tarefa não encontrada ou pertencente a outro usuário!");
    }

    const tarefaAtualizada = await EsquemaTarefa.updateOne({ _id: idTarefa }, { posicao, titulo, descricao, status, dataEntrega });
    if (tarefaAtualizada?.modifiedCount > 0) {
      const dadosTarefa = await EsquemaTarefa.findOne({ _id: idTarefa }).populate('usuarioCriador');

      res.status(200).json({
        status: "OK",
        statusMensagem: "Tarefa atualizada com sucesso.",
        resposta: dadosTarefa
      })
    }
  } catch (error) {
    return handleExpectErrors(res, error);
  }
});

router.get('/obter/usuario', authUser, connectBD, async function (req, res) {
  try {
    // #swagger.tags = ['Tarefa']
    // #swagger.description = "Endpoint para obter todas as tarefas do usuário logado."
    const usuarioLogado = req.usuarioJwt.id;
    const respostaBD = await EsquemaTarefa.find({ usuarioCriador: usuarioLogado }).populate('usuarioCriador');

    res.status(200).json({
      status: "OK",
      statusMensagem: "Tarefas listadas na resposta com sucesso!",
      resposta: respostaBD
    })

  } catch (error) {
    return handleExpectErrors(res, error);
  }
});

router.delete('/deletar/:id', authUser, connectBD, async function (req, res) {
  try {
    // #swagger.tags = ['Tarefa']
    const idTarefa = req.params.id;
    const usuarioLogado = req.usuarioJwt.id;

    const checkTarefa = await EsquemaTarefa.findOne({ _id: idTarefa, usuarioCriador: usuarioLogado });
    if (!checkTarefa) {
      throw new Error("Tarefa não encontrada ou pertencente a outro usuário!");
    }


    const respostaBD = await EsquemaTarefa.deleteOne({ _id: idTarefa });

    res.status(200).json({
      status: "OK",
      statusMensagem: "Tarefa deletada com sucesso!",
      resposta: respostaBD
    })

  } catch (error) {
    return handleExpectErrors(res, error);
  }
});




module.exports = router;