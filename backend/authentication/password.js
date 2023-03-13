const bcrypt = require('bcrypt');
// const saltRounds = 10;

class Password {
  constructor(password) {
    this.saltRounds = 10;
    this.password = password;
  }
}

class HashPassword extends Password {
  constructor(password) {
    super(password);
  }

  async hash() {
    const hashedPassword = await bcrypt.hash(this.password, this.saltRounds);
    return hashedPassword;
  }
}

class UnHashPassword extends Password {
  constructor(plainPassword, hashedPassword) {
    super(plainPassword);
    this.hashPassword = hashPassword;
  }
  async unHash() {
    const decrypt = await bcrypt.compare(this.password, this.hashPassword);

    return decrypt;
  }
}

module.exports = {
  HashPassword,
  UnHashPassword,
};
