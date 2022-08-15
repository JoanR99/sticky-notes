const Color = require('../models/color');

const findById = async (id) => await Color.findOne({ where: { id } });

const findAll = async () => await Color.findAll({});

const createColor = async (name, hex) => await Color.create({ name, hex });

const deleteColor = async (id) => await Color.destroy({ where: { id } });

module.exports = { findById, findAll, createColor, deleteColor };
