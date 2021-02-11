const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true, //중복불가
        required: true //필수 값임
    },
    password: {
        type: String,
        required: true
    }
});

//database에 save하기 전에 통과시키는 함수
//user객체를 생성하여 저장하려할때마다 salt,hash해줌
userSchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        //salt는 악의적인 유저의 rainbow attack table을 방지하기위한 랜덤값임.
        //password와 salt값을 붙인후 hash 함수를 통과하여 암호화시킴
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

//로그인시 비밀번호 비교하는 로직
//로그인시 입력한 password가 candidatePassword임
userSchema.methods.comparePassword = function(candidatePassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            //에러뜰때
            if (err) {
                return reject(err);
            }
            //비밀번호가 틀릴 때
            if (!isMatch) {
                return reject(false);
            } else {
                //맞았을때
                return resolve(true);
            }            
        });
    });
}

mongoose.model('User', userSchema);