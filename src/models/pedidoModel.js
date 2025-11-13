const { pool } = require('../config/db');

const pedidoModel = {
    insertPedido: async (pIdCliente, pValorTotal, pDataPedido, pIdProduto, pQuantidadeItem, pValorItem) => {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            // insert 1 - tabela pedidos
            const sqlPedido = 'INSERT INTO pedidos (id_cliente, valor_total, data_pedido) VALUES (?,?,?);';
            const valuesPedido = [pIdCliente, pValorTotal, pDataPedido];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            // insert 2 - itens_pedido
            const sqlItem = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, valor_item) VALUES (?,?,?,?);';
            const valuesItem = [rowsPedido.insertId, pIdProduto, pQuantidadeItem, pValorItem];
            const [rowsItem] = await connection.query(sqlItem, valuesItem);

            connection.commit();
            return { rowsPedido, rowsItem };
        } catch (error) {
            connection.rollback();
            throw error;
        }
    },

    // Inserir itens posterior a criação do pedido
    insertItem: async (pIdPedido, pIdProduto, pQuantidadeItem, pValorItem) => {
        // itens_pedido
        const sqlItem = 'INSERT INTO itens_pedido (id_pedido, id_produto, quantidade, valor_item) VALUES (?,?,?,?);';
        const valuesItem = [pIdPedido, pIdProduto, pQuantidadeItem, pValorItem];
        const [rowsItem] = await pool.query(sqlItem, valuesItem);

        let resultadoPedido;
        if (rowsItem.insertId !== 0) {
            resultadoPedido = await pedidoModel.updatePedido(pIdPedido, pQuantidadeItem, pValorItem)
        }

        return { rowsItem , resultadoPedido};
    },

    // Atualizar o valor de um pedido após a inclusão de um novo item
    updatePedido: async (pIdPedido, pQuantidadeItem, pValorItem) => {
        const sql = 'UPDATE pedidos SET valor_total = valor_total + (?*?) WHERE id_pedido=?;';
        const values = [pQuantidadeItem, pValorItem, pIdPedido];
        const [rows] = await pool.query(sql, values);
        return { rows };
    }
};

module.exports = { pedidoModel };