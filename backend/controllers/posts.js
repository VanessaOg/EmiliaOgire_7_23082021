const Post = require("../models/Post");
const fs = require("fs");

exports.getAllPosts = (req, res, next) => {
	Post.findAll()
		.then((posts) => {
			console.log(posts);
			res.status(200).json(posts);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json({ err });
		});
};

exports.getOnePost = (req, res, next) => {
	Post.findOne({ where: { id: req.params.id } })
		.then((post) => res.status(200).json(post))
		.catch((err) => res.status(400).json({ err }));
};

exports.updateOnePost = (req, res, next) => {
	const postObjet = req.file
		? {
				...JSON.parse(req.body.post),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		  }
		: { ...req.body };
	Post.update({ where: { id: req.params.id, ...req.body, id: req.params.id } })
		.then(() => res.status(200).json({ message: "post modifié" }))
		.catch((err) => res.status(400).json({ err }));
};

// Middleware pour creer une nouvelle sauce
exports.createPost = (req, res, next) => {
	const postObject = JSON.parse(req.body.post);
	const post = Post.create({
		...postObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
		likes: 0,
	});
	console.log(post.toJSON());

	post
		.save()
		.then(() => {
			res.status(201).json({
				message: "Post ajouté!",
			});
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

exports.deletePost = (req, res, next) => {
	Post.findOne({ where: { id: req.params.id } })
		.then((post) => {
			const filename = post.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Post.deleteOne({ where: { id: req.params.id } })
					.then(() => res.status(200).json({ message: "Post supprimé !" }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};
