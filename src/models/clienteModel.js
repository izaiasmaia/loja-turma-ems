const { pool } = require('../config/db');

const clienteModel = {

    /**
     * Retorna todos os clientes cadastrados na tabela clientes
     * @async
     * @function selectAll
     * @returns {Promise<Array<Object>>} Retorna um array de objetos, cada objeto representa um cliente
     * @example
     * const clientes = await clienteModel.selectAll();
     * console.log(clientes);
     * // Saída esperada
     * [
     *      {coluna1:"valorColuna1", coluna2:"valorColuna2",coluna2:"valorColuna2, ..."},
     *      {coluna1:"valorColuna1", coluna2:"valorColuna2",coluna2:"valorColuna2, ..."}
     * ]
     */
    selectAll: async () => {
        const sql = 'SELECT * FROM clientes;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selectById: async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    /**
     * Insere um cliente na base de dados
     * @param {string} pNomeCliente Descrição do nome do cliente que deve se inserido no banco de dados. Ex.: 'Pedro'
     * @param {number} pCpf CPF do cliente que deve ser inserido no banco de dados. Ex.: 12345678998
     * @returns {Promise<Object>} Retorna um objeto contento propriedades sobre o resulta da execução da query
     * @example
     * const result = await clienteModel.insert(paramA, paramB);
     * // Saída
     * 	"result": {
     * 		"fieldCount": 0,
     * 		"affectedRows": 1,
     * 		"insertId": 1,
     * 		"info": "",
     * 		"serverStatus": 2,
     * 		"warningStatus": 0,
     * 		"changedRows": 0
     * 	}
     */
    insert: async (pNomeCliente, pCpf) => {
        const sql = 'INSERT INTO clientes(nome, cpf) VALUES (?,?);';
        const values = [pNomeCliente, pCpf];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    /**
     * 
     * @param {*} pId 
     * @param {*} pNome 
     * @param {*} pCpf 
     * @returns 
     */
    update: async (pId, pNome, pCpf) => {
        const sql = 'UPDATE clientes SET nome=?, cpf=? WHERE id=?;';
        const values = [pNome, pCpf, pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },

    delete: async (pId) => {
        const sql = 'DELETE FROM clientes WHERE id = ?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    }

}

module.exports = { clienteModel };