const { validateToken } = require("../lib/jwt")

const verifyToken = (req, res, next) => {
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

    req.user = verifiedUser

    next()
  } catch (err) {
    console.log(err)
  }
}

const checkAdmin = (req, res, next) => {
  if (req.user.role_id !== 1) {
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
