const Color = require('../models/color');

module.exports.getColors = async (req, res) => {
	const colors = await Color.findAll({});

	res.json(colors);
};

module.exports.createColor = async (req, res) => {
	const { name, hex } = req.body;
	const color = await Color.create({ name, hex });

	res.json(color);
};

module.exports.deleteColor = async (req, res) => {
	const { id } = req.params;
	const color = await Color.destroy({ where: { id } });

	res.json(color);
};
