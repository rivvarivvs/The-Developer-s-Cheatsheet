import { validationResult } from 'express-validator';

exports.getAddItem = (req, res, next) => {
	if (!req.session.currentUser) {
		return res.redirect('/login');
	}
	res.render('add', {
		pageTitle: 'Add Cheatsheet',
		path: '/add',
		editing: false,
		hasError: false,
		isAuthenticated: req.session.isLoggedIn,
		errorMessage: null,
	});
};

exports.getAllItems = (req, res, next) => {
	Item.find()
		.then((item) => {
			res.render('api/item', {
				items: items,
				pageTitle: 'All',
			});
		})
		.catch((err) => res.status(400).res.json({ msg: `Err: ${err}` }));
};

exports.getItem = (req, res, next) => {
	//Rendering items
	Item.findById(req.params.id)
		.then((item) => {
			res.render('/menu/details', {
				title,
				body,
			});
		})
		.catch((err) => console.log(err));
};

exports.getUpdateItem = (req, res, next) => {
	const editMode = req.query.edit;
	if (!editMode) {
		return res.redirect('/');
	}

	Item.findById(req.params.id).then((item) => {
		if (!item) {
			return res.redirect('/');
		}
		res.render('api/item/:id/update', {
			pageTitle: 'Edit',
			path: 'api/item/:id/update',
			editing: editMode,
			hasError: false,
			item: item,
			errorMessage: null,
		});
	});
};
