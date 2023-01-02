const express = require('express')
const app = express()
const path = require('path')
const dotenv = require("dotenv").config()
const User = require('./models/user')
const session = require('express-session')
const mongoose = require('mongoose')
const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_ATLAS_USERNAME}:${process.env.MONGODB_ATLAS_PASSWORD}@cluster0.mfsduzy.mongodb.net/auth-database`
const bcrypt = require('bcrypt')
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect('/login')
    }
    next()
}

mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(3000, () => {
            console.log("Serving on port 3000")
        })
        console.log("connected to Mongodb Atlas")
    })
    .catch((err) => {
        console.log("error found")
        console.log(err)
    })
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: "iloveyou",
    resave: false,
    saveUninitialized: false
}))
app.get('/', (req, res) => {
    res.render('home')
})
app.get('/register', (req, res) => {
    res.render('register')
})
app.post('/register', async (req, res) => {
    const { password, username } = req.body

    const user = new User({ username, password })
    await user.save();
    req.session.user_id = user._id
    res.redirect('/secret')
})

app.get('/login', (req, res) => {
    res.render('login')
})
app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const foundUser = await User.findOne({ username })
    const isValid = await bcrypt.compare(password, foundUser.password)
    if (isValid) {
        req.session.user_id = foundUser._id
        res.redirect('/secret')
    } else {
        res.redirect('/login')
    }
})
app.post('/logout', (req, res) => {
    req.session.user_id = null
    res.redirect('/login')
})
app.get('/secret', requireLogin, (req, res) => {
    res.render("secret")
})