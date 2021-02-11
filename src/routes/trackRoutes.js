const express = require('express');
const mongoose = require('mongoose');
const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

//새로운 router객체 생성
const router = express.Router();

//이 파일안의 요청들은 로그인이 되어 있어야만 접근 가능하게 함
//이곳에 정의되는 모든 다른 요청은 미들웨어의 requireAuth를 사용하게 한다는 의미
router.use(requireAuth);

//user가 만든 트랙을 불러옴
router.get('/tracks', async (req, res) => {
    //현재 유저가 누구인가? = 정확하게는 id가 무엇인가?
    //requireAuth의 req값에 user의 id가 담겨있음
    const tracks = await Track.find({ userId: req.user._id });

    res.send(tracks);
});

//Track 생성
router.post('/tracks', async (req, res) => {
    //post로 들어온 names와 locations를 비구조화시켜 선언
    const { name, locations } = req.body;
    //names와 locations가 없을 때 에러처리
    if (!name || !locations) {
        return res.status(422).send({ error: 'You must provide a name and locations' });
    }

    try {
        //models의 Track클래스를 사용하여 새로운 track데이터 생성
        //name,locations은 입력받은값 userId는 requireAuth에서 넘어온 id값 사용
        const track = new Track({ name, locations, userId: req.user._id });
        //생성한 track데이터를 db에 저장
        await track.save();
        res.send(track);
    } catch (err) {
        res.status(422).send({ error: err.message });
    }
});

module.exports = router;