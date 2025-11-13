const express = require('express');
const router = express.Router();
const { produtoRoutes } = require('./produtoRoutes');
const { pedidoRoutes } = require('./pedidoRoutes');

router.use('/', produtoRoutes);
router.use('/', pedidoRoutes);

module.exports = { router };