const db = require("./models");

async function checkUsers() {
  try {
    const users = await db.User.findAll();
    console.log(JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkUsers();
