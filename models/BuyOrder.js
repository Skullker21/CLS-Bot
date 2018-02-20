module.exports = (sequelize, DataTypes) => {
	return sequelize.define('buyOrder', {
		shortName:{
			type: DataTypes.STRING,
			unique: true,
		},
		longName: {
			type: DataTypes.STRING,
		},
        category: {
            type: DataTypes.STRING,
            default: "null"
		},
        toOrder: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        
	}, {
		timestamps: false,
	});
};