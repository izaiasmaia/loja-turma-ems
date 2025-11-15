const { clienteModel } = require('../models/clienteModel');

const clienteController = {

    /**
     * Retorna os clientes cadastrados
     * Rota GET /clientes
     * @async
     * @function selecionaTodos
     * @param {Request} req Objeto da requisição HTTP
     * @param {Response} res Objeto da resposta HTTP
     * @returns {Promise<Array<Object>>} Objeto contendo o resultado da consulta
     */
    selecionaTodos: async (req, res) => {
        try {

            const { idCliente } = req.query;
            if (idCliente) {
                const resultadoCliente = await clienteModel.selectById(idCliente);
                return res.status(200).json({ data: resultadoCliente });
            }

            const resultado = await clienteModel.selectAll();
            if (resultado.length === 0) {
                return res.status(200).json({ message: 'A consulta não retornou resultados' });
            }
            res.status(200).json({ data: resultado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    incluiRegistro: async (req, res) => {
        try {
            

            if (!nome?.trim() || !cpf?.trim() || !isNaN(nome) || cpf.length !== 11) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            const resultado = await clienteModel.insert(nome, cpf);
            if (resultado.insertId === 0) {
                throw new Error('Ocorreu um erro ao incluir o Cliente');
            }
            res.status(201).json({ message: 'Registro incluído com sucesso', data: resultado });

        } catch (error) {
            console.error(error);
            if(error.errno === 1062){
                return res.status(409).json({ message: 'Já existe um CPF cadastrado com esse número', errorMessage: error.message });
            }
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message });
        }
    },

    alteraCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);
            const { nome, cpf } = req.body;

            if (!idCliente || (!nome && !cpf) || (!isNaN(nome) && !isNaN(cpf)) ||
                typeof idCliente != 'number') {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            
            if (!idCliente || !nome?.trim() || !cpf?.trim() || !isNaN(nome) || cpf.length !== 11) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente novamente' });
            }

            const clienteAtual = await clienteModel.selectById(idCliente);
            if (clienteAtual.length === 0) {
                return res.status(200).json({ message: 'Cliente não localizado na base de dados' });
            }

            const novoNome = nome ?? clienteAtual[0].nome;
            const novoCpf = cpf ?? clienteAtual[0].cpf;

            const resultUpdate = await clienteModel.update(idCliente, novoNome, novoCpf);


            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 0) {
                return res.status(200).json({ message: 'Não há alterações a serem realizadas' });
            }

            if (resultUpdate.affectedRows === 1 && resultUpdate.changedRows === 1) {
                res.status(200).json({ message: 'Registro alterado com sucesso', data:resultUpdate });
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
        }
    },

    deleteCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);

            if (!idCliente || !Number.isInteger(idCliente)) {
                return res.status(400).json({ message: 'Forneça um identificador válido' });
            }

            const clienteselecionado = await clienteModel.selectById(idCliente);
            if (clienteselecionado.length === 0) {
                return res.status(200).json({ message: 'Cliente não localizado na base de dados' });
            }

            const resultadoDelete = await clienteModel.delete(idCliente);
            if (resultadoDelete.affectedRows === 0) {
                return res.status(200).json({ message: 'Ocorreu um erro ao excluir o Cliente' });
            }

            res.status(200).json({ message: 'Cliente excluído com sucesso' });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ocorreu um erro no servidor', errorMessage: error.message })
        }
    }


}

module.exports = { clienteController };