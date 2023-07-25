const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Configuração da conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Goodx@05032002',
  database: 'banco_maligno',
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão bem-sucedida ao banco de dados MySQL');
});

// Rota para cadastrar um novo produto
app.post('/api/produtos', (req, res) => {
  const { descricao, quantidade, preco, validade } = req.body;

  if (!descricao || !quantidade || !preco || !validade) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  const query = `INSERT INTO produtos (descricao, quantidade, preco, validade) VALUES (?, ?, ?, ?)`;
  connection.query(query, [descricao, quantidade, preco, validade], (err, results) => {
    if (err) {
      console.error('Erro ao cadastrar o produto:', err);
      return res.status(500).json({ error: 'Erro ao cadastrar o produto.' });
    }

    const novoProduto = {
      id: results.insertId,
      descricao,
      quantidade,
      preco,
      validade,
    };

    return res.status(201).json(novoProduto);
  });
});

// Rota para listar todos os produtos
app.get('/api/produtos', (req, res) => {
  const query = 'SELECT * FROM produtos';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar os produtos:', err);
      return res.status(500).json({ error: 'Erro ao buscar os produtos.' });
    }

    return res.status(200).json(results);
  });
});


// Rota para editar um produto pelo ID
app.put('/api/produtos/:id', (req, res) => {
    const productId = req.params.id;
    const { descricao, quantidade, preco, validade } = req.body;
  
    if (!descricao || !quantidade || !preco || !validade) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }
  
    const query = `UPDATE produtos SET descricao = ?, quantidade = ?, preco = ?, validade = ? WHERE id = ?`;
    connection.query(query, [descricao, quantidade, preco, validade, productId], (err, results) => {
      if (err) {
        console.error('Erro ao atualizar o produto:', err);
        return res.status(500).json({ error: 'Erro ao atualizar o produto.' });
      }
  
      return res.status(200).json({ message: 'Produto atualizado com sucesso.' });
    });
  });
  
  // Rota para deletar um produto pelo ID
  app.delete('/api/produtos/:id', (req, res) => {
    const productId = req.params.id;
  
    const query = `DELETE FROM produtos WHERE id = ?`;
    connection.query(query, [productId], (err, results) => {
      if (err) {
        console.error('Erro ao deletar o produto:', err);
        return res.status(500).json({ error: 'Erro ao deletar o produto.' });
      }
  
      return res.status(200).json({ message: 'Produto deletado com sucesso.' });
    });
  });
  
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });