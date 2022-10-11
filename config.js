import dotenv from 'dotenv';

dotenv.config();

function required(key, defalutValue = undefined) {
    const value = process.env[key] || defalutValue;
    if (value == null) {
        throw new Error(`Key ${key} is undefined`);
    }
    return value;
}

export const config = {
    jwtSecretKey: required('JWT_SECRET_KEY'),
    jwtSaltRounds: parseInt(required('BCRYPT_SALT_ROUNDS')),
    jwtExpriedDays: required('JWT_EXPIRED_DAYS'),
    port: parseInt(required('PORT', 8080)),
    db: {
        host: required('DB_HOST'),
        user: required('DB_USER'),
        database: required('DB_DATABASE'),
        password: required('DB_PASSWORD'),
        port: parseInt(required('DB_PORT')),
    },
    cors: {
        allowedOrigin: required('CORS_ALLOW_ORIGIN'),
    }
   
    

    
}