const { pool } = require('../config/db');

const pedidoModel = {
    selectPedido: async () => {
        const sql = `SELECT 
                        ped.id_pedido, 
                        cli.nome, 
                        ped.valor_total, 
                        ped.data_pedido,
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id_item', itp.id_item,
                                'id_produto', itp.id_produto,
                                'nome_produto', pro.nome_produto,
                                'quantidade', itp.quantidade,
                                'valor_item', itp.valor_item
                            )
                        ) AS itens
                    FROM pedidos ped
                    JOIN clientes cli 
                        ON ped.id_cliente = cli.id 
                    JOIN itens_pedido itp 
                        ON itp.id_pedido = ped.id_pedido
                    JOIN produtos pro 
                        ON pro.id_produto = itp.id_produto
                    GROUP BY ped.id_pedido, cli.nome, ped.valor_total, ped.data_pedido;`;
        const [rows] = await pool.query(sql);
        return rows;
    },
    selectItemById: async (pIdItem) => {
        const sql = `SELECT id_item FROM itens_pedido WHERE id_item = ?;`;
        const values = [pIdItem];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    
    insertPedido: async (pIdCliente, pDataPedido, pIdProduto, pQuantidadeItem) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // insert 1 - tabela pedidos
            const sqlPedido = 'INSERT INTO pedidos (id_cliente, data_pedido) VALUES (?,?);';
            const valuesPedido = [pIdCliente, pDataPedido];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            // insert 2 - itens_pedido
            const sqlItem = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade) VALUES (?,?,?);';
            const valuesItem = [rowsPedido.insertId, pIdProduto, pQuantidadeItem];
            const [rowsItem] = await connection.query(sqlItem, valuesItem);

            connection.commit();
            return rowsPedido, rowsItem;
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    // Inserir itens posterior a criação do pedido
    insertItem: async (pIdPedido, pIdProduto, pQuantidadeItem, pValorItem) => {
        // itens_pedido
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            const sqlItem = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, valor_item) VALUES (?,?,?,?);';
            const valuesItem = [pIdPedido, pIdProduto, pQuantidadeItem, pValorItem];
            const [rowsItem] = await connection.query(sqlItem, valuesItem);

            const sqlPedido = 'UPDATE pedidos SET valor_total = valor_total +(?*?) WHERE id_pedido = ?;';
            const valuesPedido = [pQuantidadeItem, pValorItem, pIdPedido];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            connection.commit();
            return { rowsItem, rowsPedido };
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },
    
    // Atualizar o valor de um pedido após a inclusão de um novo item
    updateQtdItem: async (pIdItem, pQuantidade) => {
        const sql = 'UPDATE itens_pedido SET quantidade = ? WHERE id_item=? ;';
        const values = [pQuantidade, pIdItem];
        const [rows] = await pool.query(sql, values);
        // Tabela pedidos é atualizada com a TRIGGER: trg_atualiza_valor_pedido_after_update
        return rows;
    },


    deleteItem: async (pIdPedido, pIdItem) => {
        const sql = 'DELETE FROM itens_pedido WHERE id_item=? AND id_pedido=?;';
        const values = [pIdItem, pIdPedido];
        const [rows] = await pool.query(sql, values);
        // Tabela pedidos é atualizada com a TRIGGER: trg_atualiza_valor_pedido_after_delete
        return rows;
    },

};

module.exports = { pedidoModel };