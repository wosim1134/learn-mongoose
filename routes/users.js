const express = require('express'); // Express 모듈
const User = require('../schemas/user'); // User 모델 -> MongoDB의 사용자 컬렉션과 상호작용
const Comment = require('../schemas/comment'); // Comment 모델 -> MongoDB의 댓글 컬렉션과 상호작용

const router = express.Router(); // Express 라우터 객체 생성

// '/users' 엔드포인트에 대한 GET 요청과 POST 요청을 처리
router.route('/')
    .get(async (req, res, next) => {
        try {
            // 모든 사용자 조회
            const users = await User.find({}); 
            // 조회된 사용자 목록을 JSON 형식으로 응답
            res.json(users); 
        } catch (err) {
            console.error(err);
            next(err); // 에러를 다음 미들웨어에 전달
        }
    })
    .post(async (req, res, next) => {
        try {
            // 요청 바디에서 사용자 정보를 추출하여 새 사용자 생성
            const user = await User.create({
                name: req.body.name,
                age: req.body.age,
                married: req.body.married,
            });
            console.log(user);
            // 생성된 사용자를 JSON 형테로 응답
            res.status(201).json(user);
        } catch (err) {
            console.error(err);
            next(err); // 에러를 다음 미들웨어에 전달
        }
    });

// '/:id/comments' 엔드포인트에 대한 GET 요청을 처리
router.get('/:id/comments', async (req, res, next) => {
    try {
        // 해당 사용자의 댓글 조회
        const comments = await Comment.find({ commenter: req.params.id })
            .populate('commenter'); // 'commenter' 필드를 참조하여 사용자 정보 가져옴
        console.log(comments);
        // 조회된 댓글 목록을 JSON 형테로 응답
        res.json(comments);
        } catch (err) {
        console.error(err);
        next(err); // 에러를 다음 미들웨어에 전달
    }
});

// 이 라우터를 외부에서 사용할 수 있도록 모듈로 내보냄
module.exports = router;
