const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');

const refreshToken = async (req, res) => {
	const cookies = req.cookies;

	if (!cookies?.jwt) return res.sendStatus(401);

	const refreshToken = cookies.jwt;

	const user = await User.findOne({ where: { refreshToken: refreshToken } });

	if (!user) return res.sendStatus(403);

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err || user.id !== decoded.id) return res.sendStatus(403);

			const accessToken = jwt.sign(
				{
					user: {
						id: decoded.id,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: '1m' }
			);

			res.json({ accessToken });
		}
	);
};

module.exports = refreshToken;
