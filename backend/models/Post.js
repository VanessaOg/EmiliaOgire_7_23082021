const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const Post = sequelize.define(
	"post",
	{
		title: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		content: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		attachment: {
			type: Sequelize.STRING,
		},
		likes: {
			type: Sequelize.STRING,
		},
	},
	{
		classMethods: {
			associate: function (models) {
				// associations can be defined here
				models.Post.belongsTo(models.User);
			},
		},
	}
);

// Création de la table
// Post.sync()
// 	.then(() => console.log("Table  Post created"))
// 	.catch((error) => console.log(error));
module.exports = Post;
