module.exports = (sequelize, DataTypes) => {
	return sequelize.define('ownedAssets', {
		shortName:{
			type: DataTypes.STRING,
			unique: true,
		},
		longName: {
			type: DataTypes.STRING,
		},
		photo: {
			type: DataTypes.STRING
        },
        category: {
            type: DataTypes.STRING,
            default: "null"
		},
        owned: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        
	}, {
		timestamps: false,
	});
};