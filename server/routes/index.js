var express = require('express');
var router = express.Router();
var passport = require('passport');
// 이메일에서 gravatar 아이콘 얻기
var gravatar = require('gravatar');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express from server folder' });
});

/* GET 로그인 페이지 */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login page', message: req.flash('loginMessage') });
});
/* POST 메소드용 로그인 처리 */
router.post('/login', passport.authenticate('local-login',{
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}));

/* GET 회원가입 페이지 */
router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Signup page', message: req.flash('signupMessage') });
});
/* POST 메소드용 로그인 처리 */
router.post('/signup', passport.authenticate('local-signup',{
  successRedirect : '/profile',
  failureRedirect : '/signup',
  failureFlash : true
}));

/* GET 프로파일 페이지  */
router.get('/profile', isLoggedIn, function(req, res, next) {
    res.render('profile', 
    { 
      title: 'Profile Page', 
      user : req.user, 
      avatar: gravatar.url(req.user.email ,  {s: '100', r: 'x', d: 'retro'},true) 
    });
});

/* GET 로그아웃 페이지 */
router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});

// 사용자가 로그인했는지 확인 
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  } 
  res.redirect('/login');  
}

module.exports = router;

