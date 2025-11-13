const { pedidoModel } = require('../models/pedidoModel');


const pedidoController = {
    criarPedido: async (req, res) => {
        try {
            const { id_cliente, valor_total, data_pedido, id_produto, quantidade, valor_item } = req.body;

            if (!id_cliente || !valor_total || !data_pedido || !id_produto || !quantidade || !valor_item) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            const resultado = await pedidoModel.insertPedido(id_cliente, valor_total, data_pedido, id_produto, quantidade, valor_item);

            res.status(201).json({ message: 'Registro incluído com sucesso', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
        }
    },

    criarItem: async (req, res) => {
        try {
            const { id_pedido, id_produto, quantidade, valor_item } = req.body;

            if (!id_pedido || !id_produto || !quantidade || !valor_item) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            const resultado = await pedidoModel.insertItem(id_pedido, id_produto, quantidade, valor_item);

            res.status(201).json({ message: 'Registro incluído com sucesso', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
        }
    }

};

module.exports = { pedidoController }