module.exports = (sequelize, DataTypes) => {
	return sequelize.define('balances', {
		accountHolder: {
			type: DataTypes.STRING,
			unique: true,
		},
		money: {
			type: DataTypes.INTEGER,
			default: 0,
		},
	}, {
		timestamps: false,
	});
};