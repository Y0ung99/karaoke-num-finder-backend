import dotenv from 'dotenv';

const env = dotenv.config();

function required(name) {
    return env.parsed[name];
}

export const config = {
    jwtSecretKey: required('JWT_SECRET_KEY'),
    jwtSaltRounds: parseInt(required('BCRYPT_SALT_ROUNDS')),
    jwtExpriedDays: required('JWT_EXPIRED_DAYS'),
}