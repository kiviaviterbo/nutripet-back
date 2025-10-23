import Usuario from "../models/Usuario.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const loginController = {

  login: async (req, res) => {
    try {
      const { email, senha } = req.body;

      // Verifica se o usuário existe
      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

      // Compara senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) return res.status(401).json({ error: "Senha incorreta" });

      // Cria token JWT
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email }, token });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

export default loginController;
