const colorService = require('../services/color.services');

const getColors = async (req, res) => {
	const colors = await colorService.findAll();

	res.json(colors);
};

const createColor = async (req, res) => {
	const { name, hex } = req.body;
	const color = await colorService.createColor(name, hex);

	res.json(color);
};

const deleteColor = async (req, res) => {
	const { id } = req.params;
	await colorService.deleteColor(id);

	res.json({ message: 'Color deleted successfully' });
};

module.exports = { getColors, createColor, deleteColor };
