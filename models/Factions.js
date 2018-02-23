module.exports = (sequelize, DataTypes) => {
	return sequelize.define('factions', {
		shortName: {
			type: DataTypes.STRING,
			unique: true,
		},
		faction: {
			type: DataTypes.STRING,
		},
		reputation: {
			type: DataTypes.INTEGER,
			default: 0,
		},
	}, {
		timestamps: false,
	});
};