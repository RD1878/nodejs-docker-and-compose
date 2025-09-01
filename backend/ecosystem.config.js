module.exports = {
    apps: [
        {
            name: "kupipodariday-backend",
            script: "dist/main.js", // если у тебя NestJS
            instances: 1,
            exec_mode: "fork",
            env: {
                NODE_ENV: "production",
                PORT: process.env.PORT || 4000,
                JWT_SECRET: process.env.JWT_SECRET,
                POSTGRES_HOST: process.env.POSTGRES_HOST,
                POSTGRES_USER: process.env.POSTGRES_USER,
                POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
                POSTGRES_DB: process.env.POSTGRES_DB
            }
        }
    ]
}
