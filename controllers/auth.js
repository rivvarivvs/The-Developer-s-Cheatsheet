const express = require("express");

exports.getLogin((req, res, next) => {});

exports.postLogin((req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
});

exports.postLogout((req, req, next) => {});
