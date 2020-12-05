const connection = require("../database/connection");
const crypto = require("crypto");

module.exports = {
  async store(req, res) {
    const { email, password } = req.params;
    const crypt = crypto.createHash("sha1").update(password).digest("hex");

    const user = await connection("usuario")
      .where("senha", crypt)
      .where("email", email);
    if (user.length == 0) {
      res.status(401).send("Email ou senha incorreto");
    } else {
      res.status(200).send("Logado com sucesso");
    }
  },
};
