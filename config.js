import dotenv from 'dotenv';

const env = dotenv.config();

function required(name) {
    return env.parsed[name];
}

export const config = {
    jwtSecretKey: required('JWT_SECRET_KEY'),
    jwtSaltRounds: parseInt(required('BCRYPT_SALT_ROUNDS')),
    jwtExpriedDays: required('JWT_EXPIRED_DAYS'),
    db: {
        host: required('DB_HOST'),
        user: required('DB_USER'),
        database: required('DB_DATABASE'),
        password: required('DB_PASSWORD'),
        port: parseInt(required('DB_PORT')),
    },
    
}