const express = require('express'); // Express 모듈
const path = require('path'); // path 모듈 -> 파일 경로 관련 기능 제공
const morgan = require('morgan'); // morgan 모듈 -> HTTP 요청 로그
const nunjucks = require('nunjucks'); // 템플릿 엔진으로 Nunjucks 사용

const connect = require('./schemas'); // MongoDB 연결 함수

//
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const commentsRouter = require('./routes/comments');

const app = express(); // Express 애플리케이션 생성

// 포트 설정: 환경 변수에서 PORT 가져오거나 포트 기본값을 3000로 설정
app.set('port', process.env.PORT || 3000); 
app.set('view engine', 'html'); // 뷰 엔진을 html로 설정

// Nunjucks 설정
nunjucks.configure('views', { 
    express: app, // Express 애플리케이션에서 사용 설정
    watch: true, // 템플릿 파일 변경 감지 활성화
});

connect(); // MongoDB 연결


app.use(morgan('dev')); // 로그 미들웨어 사용 -> 개발 환경에서는 dev 포맷으로 로그
// 정적 파일 미들웨어 등록 -> public 폴더의 파일에 접근 가능
app.use(express.static(path.join(__dirname, 'public')));
// JSON 데이터 파싱 미들웨어 등록
app.use(express.json()); 
// URL 인코딩된 데이터 파싱 미들웨어 등록
app.use(express.urlencoded({ extended: false })); 

//
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/comments', commentsRouter);

// 404 에러 처리 미들웨어
app.use((req, res, next) => {
    // 요청이 들어온 HTTP 메서드와 URL 이용 -> 해당하는 라우트가 없음을 나타내는 에러 생성
    const error = new Error(`요청한 페이지를 찾을 수 없습니다: ${req.method} ${req.url}`);
    error.status = 404; // 에러 상태 코드 -> 404로 설정
    next(error); // 다음 미들웨어로 해당 에러 전달
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
    // 에러 메시지와 환경에 따라 다르게 처리
    res.locals.message = err.message; // 에러 메시지를 지역 변수에 저장
    // 개발 환경에서는 에러 객체 전달
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; 
    res.status(err.status || 500); // 에러 상태 설정 -> 기본값은 500(서버 내부 오류)
    res.render('error'); // 에러 페이지 렌더링 -> 클라이언트에 전달
});

// 포트 설정에서 서버 실행
app.listen(app.get('port'), () => {
    // 서버가 시작되었음을 콘솔에 출력
    console.log(app.get('port'), '번 포트에서 대기 중');
});
