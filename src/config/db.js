const mysql = require('mysql2/promise');

/**
 * Função para criar um pool de conexões com o banco de dados
 */
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'loja_db',
    port: 3306,
    waitForConnections: true, // Aguarda conexões livres
    connectionLimit: 10,      // Limita o número de conexões simultâneas
    queueLimit: 0             // Sem limite para a fila de conexões
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexão com o MySQL bem sucedida');
        connection.release();
    } catch (error) {
        console.error(`Erro ao conectar com o banco de dados: ${error}`);
    }
})();

module.exports = { pool };