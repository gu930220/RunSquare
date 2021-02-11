const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User'); //mongodb에 저장된 모든 유저데이터와 상호작용하게 해줌

const router = express.Router();

router.post('/signup', async (req, res) => {

    //req의 body에 들어있는객체를 비구조화하여 email,password에 할당
    const { email, password } = req.body;

    try {
        //model에서 가져온 User객체에 email과 password를 넣어서 객체 생성
        const user = new User({ email, password});
        //생성된 user객체를 db에 저장
        await user.save();

        //토큰 생성
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        //postman에 값을 보냄
        res.send({ token });
    } catch (err) {
        return res.status(422).send(err.message)
    }
});

router.post('/signin', async (req, res) => {
    //req의 body프로퍼티에 들어온 email,password를 비구조화하여 선언
    const { email, password } = req.body; 

    if(!email || !password) {
        return res.status(422).send({ error: 'Must provide email and password' });
    }

    //입력받은 email로 유저를 찾아서 user객체에 할당
    //한명찾을때 findOne사용
    const user = await User.findOne({ email })

    //email로 유저를 찾지 못했을 때
    //악의적인 유저가 id가 틀림을 식별하지못하도록 에러메시지와 에러코드를 아래로직과 통일시킴
    if (!user) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }

    //비교하는 로직에 password 넣음 에러뜨면 에러메시지 반환
    try {
        //비교
        await user.comparePassword(password);
        //비교후 이메일과 패스워드 맞다고 판단후 토큰 생성
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY')
        res.send({ token });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' })
    }
});

module.exports = router;