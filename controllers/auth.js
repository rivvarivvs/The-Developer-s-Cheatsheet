const express = require("express");
const bcrypt = require("bcryptjs");

exports.getLogin((req, res, next) => {
  res.render("/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
});

exports.getSignup = (req, res, next) => {
  res.render("register", {
    path: "/register",
    pageTitle: "Signup",
    isAuthenticated: false,
  });
};

exports.postLogin((req, res, next) => {
  const { email, password } = req.body
  User.findOne({ email })
    .then(user => {
      if (!user) {
        req.flash('error', 'Invalid email.')
        return res.redirect('/login')
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if (doMatch) {
          req.session.isLoggedIn = true
          req.session.user = user
          return req.session.save(err => {
            console.log(err)
            res.redirect('/')
          })
        }
        res.redirect('/login')
      })
      .catch(err => {
        console.log(err)
      })
    })
    .catch(err => console.log(err))
})

exports.postLogout((req, req, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
});

exports.postSignup((req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      return bcrypt
      .hash(password, 12)
      .then(hashedPassword => {
        const newUser = new User({
          name: name,
          email: email,
          password: hashedPassword,
        });
        return newUser.save();
      });
    })
    .catch(err => {
      console.log(err)
    })
});