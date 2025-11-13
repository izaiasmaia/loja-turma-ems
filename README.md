
# 🛒 Sistema de Pedidos e Produtos (Node.js + MySQL)

Este projeto é uma **API RESTful** desenvolvida em **Node.js** com **Express** e **MySQL**, que permite gerenciar **produtos**, **clientes**, **pedidos** e **itens de pedido**.  
Ela é ideal para estudos sobre integração entre Node.js e MySQL, uso de transações e boas práticas de arquitetura em camadas (Model, Controller, Route).

---

## 🚀 Tecnologias utilizadas

- **Node.js**  
- **Express**  
- **MySQL**  
- **mysql2 (Promise API)**

---

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza o banco de dados `teste`.  
Execute o script abaixo no seu MySQL para criar as tabelas:

```sql
CREATE DATABASE teste;
USE teste;

CREATE TABLE produtos (
  id_produto INT NOT NULL AUTO_INCREMENT,
  nome_produto VARCHAR(100) NOT NULL,
  valor_produto DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id_produto)
);

CREATE TABLE clientes (
  id INT NOT NULL AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  cpf CHAR(11) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY cpf (cpf)
);

CREATE TABLE pedidos (
  id_pedido INT NOT NULL AUTO_INCREMENT,
  id_cliente INT NOT NULL,
  valor_total DECIMAL(10,2) NOT NULL,
  data_pedido DATE NOT NULL,
  PRIMARY KEY (id_pedido, id_cliente),
  CONSTRAINT fk_pedidos_clientes 
    FOREIGN KEY (id_cliente) REFERENCES clientes (id)
);

CREATE TABLE itens_pedido (
  id_item INT NOT NULL AUTO_INCREMENT,
  id_pedido INT NOT NULL, 
  id_produto INT NOT NULL, 
  quantidade DECIMAL(7,3) NOT NULL, 
  valor_item DECIMAL(10,2) NOT NULL, 
  PRIMARY KEY (id_item),
  CONSTRAINT fk_itens_pedido_pedidos 
    FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido),
  CONSTRAINT fk_itens_pedido_produtos 
    FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
);
````

---

## ⚙️ Configuração do Projeto

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/izaiasmaia/loja-turma-ems.git
cd sistema-pedidos
```

### 2️⃣ Instale as dependências

```bash
npm install express mysql2
```


O servidor será iniciado em:
```
http://localhost:8000
```

---

## 🌐 Endpoints da API

### 📦 Produtos

| Método     | Rota                    | Descrição                     |
| ---------- | ----------------------- | ----------------------------- |
| **GET**    | `/produtos`             | Lista todos os produtos       |
| **GET**    | `/produtos?idProduto=1` | Busca um produto pelo ID      |
| **POST**   | `/produtos`             | Cria um novo produto          |
| **PUT**    | `/produtos/:idProduto`  | Atualiza um produto existente |
| **DELETE** | `/produtos/:idProduto`  | Remove um produto pelo ID     |

---

### 🧾 Pedidos

| Método   | Rota                | Descrição                                   |
| -------- | ------------------- | ------------------------------------------- |
| **POST** | `/pedidos`          | Cria um novo pedido com o primeiro item     |
| **POST** | `/pedidos/novoItem` | Adiciona um novo item a um pedido existente |

---

## 📘 Exemplos de Requisição

### ➕ Criar Produto

**POST** `/produtos`

```json
{
  "descricao": "Mouse Gamer",
  "valor": 129.90
}
```

---

### ✏️ Atualizar Produto

**PUT** `/produtos/1`

```json
{
  "descricao": "Mouse Gamer RGB",
  "valor": 149.90
}
```

---

### 🧾 Criar Pedido

**POST** `/pedidos`

```json
{
  "id_cliente": 1,
  "valor_total": 259.80,
  "data_pedido": "2025-11-13",
  "id_produto": 1,
  "quantidade": 2,
  "valor_item": 129.90
}
```

---

### ➕ Adicionar Item ao Pedido Existente

**POST** `/pedidos/novoItem`

```json
{
  "id_pedido": 1,
  "id_produto": 2,
  "quantidade": 1,
  "valor_item": 89.90
}
```

🧠 O campo `valor_total` na tabela **pedidos** será automaticamente atualizado.

---

## 📁 Estrutura do Projeto

```
src/
│
├── docs/                    # documentos utilizados no projeto (teste do Insomnia, script sql, etc)
├── config/
│   └── db.js                # Configuração do banco de dados
│
├── models/
│   ├── produtoModel.js      # Queries SQL para produtos
│   └── pedidoModel.js       # Queries SQL para pedidos e itens
│
├── controllers/
│   ├── produtoController.js # Lógica dos endpoints de produtos
│   └── pedidoController.js  # Lógica dos endpoints de pedidos
│
├── routes/
│   ├── produtoRoutes.js
│   ├── pedidoRoutes.js
│   └── routes.js            # Agrupa todas as rotas
│
└── server.js                # Ponto de entrada da aplicação
```

---

## 🧠 Funcionalidades

* CRUD completo para **produtos**
* Criação de **pedidos com itens**
* Atualização automática do valor total do pedido
* Uso de **transações MySQL** para garantir integridade
* Estrutura modular e escalável

---

## 🚀 Melhorias Futuras

* Autenticação de usuários com **JWT**
* Validação de entrada com **express-validator**
* Testes automatizados com **Jest**
* Middleware de tratamento de erros
* Listagem de pedidos com seus itens e clientes

---

## 📝 Licença

Este projeto é **livre para uso educacional** e pode ser adaptado para estudos, testes ou aprimoramentos pessoais.
Sinta-se à vontade para clonar e evoluir o código! 💻

---

📌 Desenvolvido com ❤️ em **Node.js + Express + MySQL**
