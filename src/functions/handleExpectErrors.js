const S = require('string');

function handleExpectErrors(res, err) {

    // Condição ocorre quando há algum erro no mongoose
    if (String(err).includes(`Validation Error: `)) {
        return res.status(400).json({
            status: "Erro",
            statusMensagem: S(String(err).replace("ValidationError: ", "")).replaceAll(':','').s,
            resposta: String(err)
        });
    }
    // Condição ocorre por um erro criado manualmente 
    if (String(err).includes(`Error: `)) {
        return res.status(400).json({
            status: "Erro",
            statusMensagem: String(err).replace("Error ", ""),
            resposta: String(err)
        });
    }

    // Erro inesperado
    console.error(err);
    return res.status(500).json({
        status: "Erro",
        statusMensagem: "Houve um problema inesperado, tente novamente mais tarde.",
        resposta: String(err)
    });
}

module.exports = handleExpectErrors;