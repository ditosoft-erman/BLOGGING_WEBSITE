const jwt = require('jsonwebtoken');

const renewToken = (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    console.log('Refresh Token:', refreshToken);

    if (!refreshToken) {
        return Promise.reject({ valid: false, message: 'No Refresh token' });
    }

    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, decoded) => {
            if (err) {
                return reject({ valid: false, message: 'Invalid Refresh Token' });
            }

            const accessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET_KEY, {
                expiresIn: '15m',
            });

            res.cookie('accessToken', accessToken, { maxAge: 15 * 60 * 1000, httpOnly: true, sameSite: 'strict' });
            resolve(true);
        });
    });
};

module.exports = renewToken;
