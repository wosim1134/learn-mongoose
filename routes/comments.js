const express = require('express'); // Express 모듈
const Comment = require('../schemas/comment'); // Comment 모델 불러오기 -> MongoDB의 댓글 컬렉션과 상호작용

const router = express.Router(); // Express 라우터 객체 생성

// '/comments' 엔드포인트에 대한 POST 요청을 처리
router.post('/', async (req, res, next) => {
    try {
        // 요청 바디에서 댓글 정보를 추출하여 새 댓글 생성
        const comment = await Comment.create({
            commenter: req.body.id,
            comment: req.body.comment,
        });
        console.log(comment);
        // 생성된 댓글을 가져와 사용자 정보를 포함하여 JSON 형대로 응답
        const result = await Comment.populate(comment, { path: 'commenter' });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
        next(err); // 에러를 다음 미들웨어에 전달
    }
});

// '/comments/:id' 엔드포인트에 대한 PATCH 요청과 DELETE 요청 처리
router.route('/:id')
    // PATCH 요청 처리
    .patch(async (req, res, next) => {
        try {
            // 해당 ID를 가진 댓글을 업데이트
            const result = await Comment.updateOne({
                _id: req.params.id,
            }, {
                comment: req.body.comment,
            });
            res.json(result); // 결과를 JSON 형식으로 응답
        } catch (err) {
            console.error(err);
            next(err); // 에러를 다음 미들웨어에 전달
        }
    })
    // DELETE 요청 처리
    .delete(async (req, res, next) => {
        try {
            // 해당 ID를 가진 댓글을 삭제
            const result = await Comment.deleteOne({ _id: req.params.id });
            res.json(result); // 삭제된 결과를 JSON 형식으로 응답
        } catch (err) {
            console.error(err);
            next(err); // 에러를 다음 미들웨어에 전달
        }
    });

// 이 라우터를 외부에서 사용할 수 있도록 모듈로 내보냄
module.exports = router;
