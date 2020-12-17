const express = require("express");
const { validationResult } = require("express-validator/check");

//Item model
const Item = require("../models/Item");

exports.getAddItem = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  res.render("add", {
    pageTitle: "Add Cheatsheet",
    path: "/add",
    editing: false,
    hasError: false,
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: null,
  });
};

exports.getAllItems = (req, res, next) => {
  Item.find()
    .then((item) => {
      res.render("api/item", {
        items: items,
        pageTitle: "All",
      });
    })
    .catch((err) => res.status(400).res.json({ msg: `Err: ${err}` }));
};

exports.getItem = (req, res, next) => {
  //Rendering items
  Item.findById(req.params.id)
    .then((item) => {
      res.render("/menu/details", {
        title,
        body,
      });
    })
    .catch((err) => console.log(err));
};

exports.postAddItem = (req, res, next) => {
  const title = req.body.title;
  const body = req.body.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("api/item/:id/update", {
      pageTitle: "Edit",
      path: "api/item/:id/update",
      hasError: true,
      editing: false,
      item: {
        title,
        body,
      },
      errorMessage: errors.array()[0].msg,
    });
  }

  const newItem = new Item({
    title: title,
    body: body,
    userId: req.user._id,
  });

  newItem.save().then((i) => res.json(i));
};

exports.getUpdateItem = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  Item.findById(req.params.id).then((item) => {
    if (!item) {
      return res.redirect("/");
    }
    res.render("api/item/:id/update", {
      pageTitle: "Edit",
      path: "api/item/:id/update",
      editing: editMode,
      hasError: false,
      item: item,
      errorMessage: null,
    });
  });
};

exports.postUpdateItem = (req, res, next) => {
  const updatedTitle = req.body.title;
  const updatedBody = req.body.body;

  Item.findById(req.params.id).then((item) => {
    item.title = updatedTitle;
    item.body = updatedBody;

    return item
      .save()
      .then((result) => {
        console.log("Updated item");
        res.redirect("/");
      })
      .catch((err) => console.log(err));
  });
};

exports.postDeleteProduct = (req, res, next) => {
  Item.findByIdAndRemove(req.params.id)
    .then(() => console.log("Item removed"))
    .catch((err) => res.status(400).json({ msg: `Err: ${err}` }));
};
