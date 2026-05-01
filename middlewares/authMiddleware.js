const { validateToken } = require("../lib/jwt")
const db = require("../models");

const verifyToken = async (req, res, next) => {
  let token = req.headers.authorization

  if (!token) {
    return res.status(401).json({
      message: "User unauthorized",
    })
  }

  try {
    token = token.split(" ")[1]

    const verifiedUser = validateToken(token)

    if (!verifiedUser) {
      return res.status(401).json({
        message: "Unauthorized request",
      })
    }

    const is_admin = await db.User.findOne({
      where: {
        id: verifiedUser.id,
      },
    });

    req.user = { ...verifiedUser, is_admin: is_admin.is_admin };

    next();
  } catch (err) {
    console.log(err)
  }
}

const checkAdmin = (req, res, next) => {
  if (!req.user.is_admin) {
    return res.status(403).json({
      message: "Admin only request",
    })
  }
  next()
}

module.exports = {
  verifyToken,
  checkAdmin,
}
