import express from "express";
import bcrypt from "bcrypt";

const app = express();
const port = 6666;

app.use(express.json());

app.get("/", (request, response) => {
  return response.json("OK");
});

app.listen(port, () =>
  console.log(`Servidor iniciado rodando na porta ${port}`)
);

// Desafio final

// Aplicação Lista de Recados

// ● Vamos criar um back-end que contém
// as seguintes funcionalidades:
// ○ Criação de conta
// ○ Login
// ○ CRUD* de recados

// *CRUD (create, read, update e delete)

// ● Dados de um usuário:
// ○ Identificador
// ○ Nome
// ○ E-mail
// ○ Senha

// ● Dados de um recado:
// ○ Identificador
// ○ Título
// ○ Descrição

// Regras
// ● Não pode ter mais de um usuário
// com o mesmo e-mail

// ● O login deve ser feito com e-mail e
// senha

// ● Cada recado deve ser de um único
// usuário.

const usuarios = [];
const recados = [];
let identificador = 1;
let idRecado = 1;



app.post("/usuarios", async (req, res) => {
  const data = req.body;

  const nome = data.nome;
  const email = data.email;
  const senha = data.senha;

  const hashedSenha = await bcrypt.hash(senha, 10);

  const usuarioEmail = usuarios.find((usuario) => usuario.email === email);

  if(usuarioEmail){
    res.status(409).json({message: "E-mail já cadastrado!"});
  } 

  const usuario = {
    identificador,
    nome,
    email,
    hashedSenha,
  };
  identificador++;
  usuarios.push(usuario);
  res.status(200).json({ message: "Usuário cadastrado" });
});



app.get("/usuarios", (req, res) => {
    return res.status(200).json({
      success: true,
      msg: "Lista de usuários retornado com sucesso.",
      lista: usuarios,
    });
  });



app.post("/login", (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  const usuarioFiltrado = usuarios.find((usuario) => usuario.email === email);

  if (usuarioFiltrado) {
    bcrypt.compare(senha, usuarioFiltrado.hashedSenha, (error, result) => {
      if (result) {
        res.status(200).json({ success: true, message: "Login bem-sucedido!" });
      } else {
        res.status(400).json({
          success: false,
          message: "Usuário ou Senha incorretos!",
          error: error,
        });
      }
    });
  } else {
    res.status(404).json({ message: "Usuário não encontrado." });
  }
});



app.post("/recados", (req, res) => {
  const data = req.body;
  const email = data.email;

  const titulo = data.titulo;
  const descricao = data.descricao;
    
  const emailFiltrado = usuarios.find((usuario) => usuario.email === email);

  if (!emailFiltrado) {
    res.status(404).json({ message: "E-mail não encontrado" });
  }

  const recado = {
    idRecado,
    email,
    titulo,
    descricao,
  };
  idRecado++
  recados.push(recado);

  res.status(200).json({ message: "Recado postado com sucesso!" });
});



app.get("/recados", (req, res) => {
  return res.status(200).json({ message: "Recados retornados com sucesso.", recados:recados});
});



app.put("/recados/:idRecado", (req, res) => {
  const data = req.body;

  const idRecado = parseInt(req.params.idRecado);
  const descricao = data.descricao;
  const titulo = data.titulo;

  const idRecadoFiltrado = recados.find(
    (recado) => recado.idRecado === idRecado
  );

  if (idRecadoFiltrado) {
    idRecadoFiltrado.titulo = titulo;
    idRecadoFiltrado.descricao = descricao;

    res.status(200).json({ message: "Recado alterado com sucesso!" });
  } else {
    res.status(404).json({ message: "Recado não localizado!" });
  }
});



app.delete("/recados/:idRecado", (req, res) => {
    const idRecado = parseInt(req.params.idRecado);
    const idRecadoIndex = recados.findIndex((recado) => recado.idRecado === idRecado);
    
    if (idRecadoIndex !== -1) {
        recados.splice(idRecadoIndex, 1);

        res.status(200).json({
            message: "Recado deletado com sucesso!"
        });
    } else {
        res.status(404).json({
            message: "Recado não localizado!"
        });
    }
});