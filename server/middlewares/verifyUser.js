const jwt = require('jsonwebtoken');
const renewToken = require('./renewToken');

const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    console.log('Access Token:', accessToken);

    if (!accessToken) {
        try {
            const renewed = await renewToken(req, res);
            if (renewed) {
                next();
            } else {
                return res.status(401).json({
                    valid: false,
                    message: 'Token renewal failed or no access token provided'
                });
            }
        } catch (error) {
            return res.status(401).json(error);
        }
    } else {
        jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    valid: false,
                    message: 'Invalid Access Token'
                });
            } else {
                req.userId = decoded.userId;
                next();
            }
        });
    }
};

module.exports = verifyUser;
