const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup', async (req, res) => {

    //req의 body에 들어있는객체를 비구조화하여 email,password에 할당
    const { email, password } = req.body;

    //model에서 가져온 User객체에 email과 password를 넣어서 객체 생성
    const user = new User({ email, password});
    //생성된 user객체를 db에 저장
    await user.save();

    //postman에 값을 보냄
    res.send('You made a post request');
});

module.exports = router;