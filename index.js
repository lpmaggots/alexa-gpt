const express = require("express");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use variável de ambiente
});

app.use(bodyParser.json());

app.post("/alexa", async (req, res) => {
  try {
    const intent = req.body.request.intent;
    const userInput = intent?.slots?.userInput?.value;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userInput }],
      temperature: 0.7,
    });

    const responseText = completion.choices[0].message.content;

    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: responseText,
        },
        shouldEndSession: false,
      },
    });
  } catch (err) {
    console.error("Erro:", err);
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Desculpe, ocorreu um erro ao processar sua solicitação.",
        },
        shouldEndSession: true,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
