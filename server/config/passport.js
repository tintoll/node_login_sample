//  패스포트 모듈 로드
var LocalStrategy = require('passport-local').Strategy;
// user 모델 가져오기
var User = require('../models/users');

module.exports = function(passport) {

	// 패스포트 초기화 설정
	// 세션을 위해 user 직렬화
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});
  // user 역직렬화
	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// local strategy 사용
	passport.use('local-login', new LocalStrategy({
		// 사용자명과 패스워드의 기본값을 'email'과 'password'로 변경
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		// 소문자로 변환
		if(email) email = email.toLowerCase();
		// 비동기 처리
		process.nextTick(function(){
			User.findOne({'local.email' : email}, function(err, user){
				if(err) return done(err);
				if(!user) return done(null, false, req.flash('loginMessage', 'No User found.'));
				if(!user.validPassword(password)) 
					return done(null, false, req.flash('loginMessage', 'Wohh! Wrong password.'));
				else
					return done(null, user);
			});
		});
	}));

	// local strategy 등록
	passport.use('local-signup', new LocalStrategy({
		// 사용자명과 패스워드의 기본값을 'email'과 'password'로 변경
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	},
	function(req, email, password, done) {
		// 소문자로 변환
		if(email) email = email.toLowerCase();
		// 비동기 처리
		process.nextTick(function(){
			// user가 아직 로그인 하지 않았다면
			if(!req.user){
				User.findOne({'local.email' : email}, function(err, user){
					if(err) return done(err);
					// 이메일 중복검사
					if(user){
						return done(null, false, req.flash('signupMessage', 'Wohh! the email is already taken.'));
					} else {
						// user 생성
						var newUser = new User();
						newUser.local.name = req.body.name;
						newUser.local.email = email;
						newUser.local.password = newUser.generateHash(password);
						// 데이터 저장
						newUser.save(function(err){
							if(err) throw err;
							return done(null, newUser);
						});
					}
					
				});
			} else {
				return done(null, req.user);
			}
		});
	}));


}