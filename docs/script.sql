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



-- Atualiza o valor do pedido após um insert de um novo item (itens_pedido)
DELIMITER $$

CREATE TRIGGER trg_atualiza_valor_pedido_after_insert
AFTER INSERT ON itens_pedido
FOR EACH ROW
BEGIN
    UPDATE pedidos
    SET valor_total = valor_total + (NEW.quantidade * NEW.valor_item)
    WHERE id_pedido = NEW.id_pedido;
END $$

DELIMITER ;

-- Atualizar o valor_total do pedido caso um item seja deletado
DELIMITER $$
CREATE TRIGGER trg_atualiza_valor_pedido_after_delete
AFTER DELETE ON itens_pedido
FOR EACH ROW
BEGIN
    UPDATE pedidos
    SET valor_total = valor_total - (OLD.quantidade * OLD.valor_item)
    WHERE id_pedido = OLD.id_pedido;
END $$

DELIMITER ;

-- Atualizar o valor_total do pedido caso um item seja alterado
DELIMITER $$
CREATE TRIGGER trg_atualiza_valor_pedido_after_update
AFTER UPDATE ON itens_pedido
FOR EACH ROW
BEGIN
    -- Só atualiza se a quantidade ou o valor mudarem
    IF NEW.quantidade <> OLD.quantidade 
       OR NEW.valor_item <> OLD.valor_item THEN

        UPDATE pedidos
        SET valor_total = valor_total
            - (OLD.quantidade * OLD.valor_item)
            + (NEW.quantidade * NEW.valor_item)
        WHERE id_pedido = NEW.id_pedido;

    END IF;
END $$

DELIMITER ;

-- Insere o valor do produto na tabela itens_pedido antes de inserir um novo item
DELIMITER $$
CREATE TRIGGER trg_atualiza_valor_item_before_insert
BEFORE INSERT ON itens_pedido
FOR EACH ROW
BEGIN
    -- Atribui o valor ao item do pedido
    SET NEW.valor_item = (SELECT valor_produto 
    FROM produtos
    WHERE id_produto = NEW.id_produto);
END $$

DELIMITER ;

/*
-- Atualiza o valor do produto na tabela itens pedido
DELIMITER $$

CREATE TRIGGER trg_atualiza_valor_item_before_update
BEFORE UPDATE ON itens_pedido
FOR EACH ROW
BEGIN
    -- Atribui o valor ao item do pedtrg_itens_pedido_before_updateido
    SET NEW.valor_item = (SELECT valor_produto 
    FROM produtos
    WHERE id_produto = NEW.id_produto);
END $$

DELIMITER ;
*/

-- DROP TRIGGER trg_atualiza_valor_pedido_after_delete



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

-- Soma itens individualmente agrupando por pedido
SELECT 
	ip.id_pedido, 
	SUM( ip.quantidade * ip.valor_item) as total_itens
FROM itens_pedido ip 
INNER JOIN pedidos p
	ON ip.id_pedido = p.id_pedido
GROUP BY ip.id_pedido