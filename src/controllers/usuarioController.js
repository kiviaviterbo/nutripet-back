import Usuario from "../models/Usuario.js";
import Assinatura from "../models/Assinatura.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const usuarioController = {

  criar: async (req, res) => {
    try {
      const { nome, email, senha, telefone } = req.body;

      if (!nome || !email || !senha)
        return res.status(400).json({ msg: "Preencha todos os campos obrigatórios." });

      // Verifica se o e-mail já existe
      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente)
        return res.status(400).json({ msg: "E-mail já cadastrado." });

      // Criptografa a senha antes de salvar
      const senhaHash = await bcrypt.hash(senha, 10);

      // Cria o usuário no banco
      const usuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        telefone,
      });

      // Gera token JWT (para login automático após cadastro)
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Retorna dados + token, no mesmo formato do login
      res.status(201).json({
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
        token,
      });
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      res.status(500).json({ msg: "Erro interno no servidor.", error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        include: [
          {
            model: Assinatura,
            attributes: ["data_inicio", "data_fim"]
          }
        ]
      });
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        include: [{ model: Assinatura, attributes: ["data_inicio", "data_fim"] }]
      });
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, email, senha, telefone } = req.body;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
      await usuario.update({ nome, email, senha, telefone });
      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id);
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
      await usuario.destroy();
      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Função para verificar se o usuário é premium
  verificarPremium: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findByPk(id, {
        include: [{
          model: Assinatura,
          attributes: ["data_inicio", "data_fim"]
        }]
      });
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

      const assinaturaAtiva = usuario.Assinaturas.some(
        a => !a.data_fim || new Date(a.data_fim) >= new Date()
      );

      res.json({ is_premium: assinaturaAtiva });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

export default usuarioController;
