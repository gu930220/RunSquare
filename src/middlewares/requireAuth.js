const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
    // authorization을 
    const { authorization } = req.headers;
    // authorization === 'bearer alkdanskldn'

    // authorization이 없을경우 에러처리
    if (!authorization) {
        return res.status(401).send({ error: 'You must be logged in.1'});
    }

    //token값만 빼기
    const token = authorization.replace('Bearer ', '');
    console.log(token);

    //token값으로 user를 식별해주는 로직
    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
        //error발생시
        if(err) {
            return res.status(401).send({ error: 'You must be logged in.2' });
        }
        console.log(payload);
        //payload에 담겨온 userId를 비구조화로 선언
        const { userId } = payload;

        //mongodb에 userId로 User객체에서 검색하여 user에 할당
        const user = await User.findById(userId);

        //req.user에 user에 할당한 데이터를 넣고 다음으로 넘어감
        req.user = user;
        next();
    });
};