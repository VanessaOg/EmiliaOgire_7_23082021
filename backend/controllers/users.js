const User = require("../models/User");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");

// Create a schema
const schemaPassword = new passwordValidator();

// Add properties to it
schemaPassword
	.is()
	.min(8) // Minimum length 8
	.is()
	.max(20) // Maximum length 20
	.has()
	.uppercase() // Must have uppercase letters
	.has()
	.lowercase() // Must have lowercase letters
	.has()
	.digits(2) // Must have at least 2 digits
	.has()
	.not()
	.spaces(); // Should not have spaces

exports.signup = (req, res, next) => {
	// Vérification des champs vides
	if (!req.body.email || !req.body.password || !req.body.username) {
		return res.status(400).json({ error: "Remplissez tous les champs" });
	}

	// à faire si email valide et existe alors l'email existe déjà veillez le changer ou vous connecter
	if (emailValidator.validate(req.body.email)) {
		if (User.findOne({ where: { email: req.params.email } })) {
			return res
				.status(400)
				.json({ error: "Cet email existe déjà veillez le changer ou vous connecter" });
		} else if (schemaPassword.validate(req.body.password)) {
			bcrypt
				.hash(req.body.password, 10) //la methode hash fait 10 tour de l'algorithme pour crypter le mdp
				.then((hash) => {
					const user = new User({
						username: req.body.username,
						email: req.body.email,
						password: hash,
						bio: req.body.bio,
						isAdmin: 0,
					});
					User.create(user)
						.save()
						.then(() => res.status(201).json({ message: "Utilisateur créé !" }))
						.catch((error) => res.status(400).json({ error }));
				})
				.catch((error) => res.status(500).json({ error }));
		} else {
			return res.status(400).json({
				error:
					"Le mot de passe doit contenir entre entre 8 et 20 caractères sans espaces, au moins une majuscule et une minuscule, 2 chiffres",
			});
		}
	} else {
		return res.status(400).json({ error: "L'email n'est pas valide" });
	}
};
//on hash le mdp et on enregistre le user dans la BDD

exports.login = (req, res, next) => {
	if (req.body.email == null || req.body.password == null) {
		return res.status(400).json({ error: "Remplissez tous les champs" });
	}
	models.User.findOne({ where: { email: req.body.email } })
		.then((user) => {
			if (!user) {
				return res.status(401).json({ error: "Utilisateur non trouvé !" });
			}
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					if (!valid) {
						return res.status(401).json({ error: "Mot de passe incorrect !" });
					}
					res.status(200).json({
						userId: user.id,
						token: jwt.sign({ userId: user.id }, "RANDOM_TOKEN_SECRET", { expiresIn: "24h" }),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
