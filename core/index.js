module.exports.parseCookies = (request) => {
    const list = {};
    const cookieHeader = request.headers?.access_token;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [ name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

module.exports.ensureAuthenticated = (req, res, next) => {
    if (!req.cookies["access_token"]) return res.sendStatus(401);
    const token = req.cookies["access_token"];
    axios.get(
    `${process.env.verifyAddress}/api/auth/verify`,
    {
        withCredentials: true,
        headers: {
        "Cookie": `access_token=${token};`,
        },
    }
    )
    .then((response) => {
        var response = response.data;
        req.userData = {
        token,
        address: response.address,
        };
        next();
    },
        (error) => {
        console.log(error);
        next(error);
        }
    );
  };