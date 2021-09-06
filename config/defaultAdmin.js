const Admin = require("../models/Admin");
const config = require("config");
const defaultAdminConfig = config.get("admin");
const bcrypt = require("bcryptjs");

const defaultAdmin = async () => {
  try {
    const admin = await Admin.findOne({ name: "Admin" });
    if (!admin) {
      const admin = new Admin(defaultAdminConfig);

      const salt = await bcrypt.genSalt(10);

      admin.password = await bcrypt.hash(defaultAdminConfig.password, salt);

      await admin.save();
      console.log("Default Admin created");
    }
    console.log("Default admin found");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = defaultAdmin;
