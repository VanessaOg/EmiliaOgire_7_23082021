const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
	"User",
	{
		username: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		email: {
			type: Sequelize.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false,
		},
		bio: {
			type: Sequelize.STRING,
		},
		isAdmin: {
			type: Sequelize.BOOLEAN,
		},
	},
	{
		classMethods: {
			associate: function (models) {
				// associations can be defined here
				models.User.hasMany(models.Post);
			},
		},
	}
);

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true
// User.sync()
// 	.then(() => console.log("The table for the User model is created"))
// 	.catch((error) => console.log(error));

module.exports = User;
