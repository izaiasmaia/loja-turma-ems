CREATE DATABASE teste;

USE teste;

CREATE TABLE produtos (
  id_produto int NOT NULL AUTO_INCREMENT,
  nome_produto varchar(100) NOT NULL,
  valor_produto decimal(10,2) NOT NULL,
  PRIMARY KEY (id_produto)
);

CREATE TABLE clientes (
  id int NOT NULL AUTO_INCREMENT,
  nome varchar(100) NOT NULL,
  cpf char(11) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY cpf (cpf)
);

CREATE TABLE pedidos (
  id_pedido int NOT NULL AUTO_INCREMENT,
  id_cliente int NOT NULL,
  valor_total decimal(10,2) NOT NULL,
  data_pedido date NOT NULL,
  PRIMARY KEY (id_pedido,id_cliente),
  CONSTRAINT fk_pedidos_clientes 
	FOREIGN KEY (id_cliente) REFERENCES clientes (id)
);

CREATE TABLE itens_pedido (
  id_item int NOT NULL AUTO_INCREMENT,
  id_pedido int NOT NULL, 
  id_produto int NOT NULL, 
  quantidade decimal (7,3) NOT NULL, 
  valor_item decimal(10,2) NOT NULL, 
  PRIMARY KEY (id_item),
  CONSTRAINT fk_itens_pedido_pedidos 
	FOREIGN KEY (id_pedido) REFERENCES pedidos (id_pedido),
  CONSTRAINT fk_itens_pedido_produtos 
	FOREIGN KEY (id_produto) REFERENCES produtos (id_produto)
);




-- Selecionar e retornar um JSON em um único campo
SELECT 
    ped.id_pedido,
    cli.nome AS nome_cliente,
    ped.valor_total,
    ped.data_pedido,
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id_item', ite.id_item,
            'id_produto', pro.id_produto,
            'nome_produto', pro.nome_produto,
            'quantidade', ite.quantidade,
            'valor_item', ite.valor_item
        )
    ) AS itens
FROM pedidos ped
JOIN clientes cli 
    ON ped.id_cliente = cli.id
JOIN itens_pedido ite 
    ON ite.id_pedido = ped.id_pedido
JOIN produtos pro 
    ON pro.id_produto = ite.id_produto
GROUP BY ped.id_pedido, cli.nome, ped.valor_total, ped.data_pedido;