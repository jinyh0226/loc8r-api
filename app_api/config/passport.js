const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');

passport.use(new LocalStrategy(
    {
        usernameField: 'email', // 이메일을 사용자명으로 지정
    },
    async (username, password, done) => {
        try {
            // 사용자 조회 (비동기 호출)
            const user = await User.findOne({ email: username });

            if (!user) {
                // 사용자 없음
                return done(null, false, { message: 'Incorrect username.' });
            }

            // 비밀번호 유효성 검사 (validPassword는 스키마 메서드로 가정)
            const isValidPassword = await user.validPassword(password); // 비동기로 처리
            if (!isValidPassword) {
                return done(null, false, { message: 'Incorrect password.' });
            }

            // 인증 성공
            return done(null, user);
        } catch (err) {
            // 인증 중 에러 처리
            return done(err);
        }
    }
));



