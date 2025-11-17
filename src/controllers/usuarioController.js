import Usuario from "../models/Usuario.js";
import Assinatura from "../models/Assinatura.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usuarioController = {

  // =============================
  // CADASTRAR USUÁRIO
  // =============================
  criar: async (req, res) => {
    try {
      const {
        cpf, nome, email, senha, telefone,
        cep, endereco, numero, estado, bairro,
        data_nascimento, profissao, renda, celular
      } = req.body;

      if (!cpf || !nome || !email || !senha)
        return res.status(400).json({ msg: "Preencha todos os campos obrigatórios." });

      const cpfExistente = await Usuario.findOne({ where: { cpf } });
      if (cpfExistente)
        return res.status(400).json({ msg: "CPF já cadastrado." });

      const emailExistente = await Usuario.findOne({ where: { email } });
      if (emailExistente)
        return res.status(400).json({ msg: "E-mail já cadastrado." });

      const senhaHash = await bcrypt.hash(senha, 10);

      const usuario = await Usuario.create({
        cpf, nome, email, senha: senhaHash, telefone,
        cep, endereco, numero, estado, bairro,
        data_nascimento, profissao, renda, celular
      });

      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET,
        { expiresIn: "7h" }
      );

      return res.status(201).json({
        usuario: {
          id: usuario.id,
          cpf: usuario.cpf,
          nome: usuario.nome,
          email: usuario.email
        },
        token
      });

    } catch (error) {
      console.error("Erro criar usuário:", error);
      return res.status(500).json({ msg: "Erro interno.", error });
    }
  },

  listar: async (req, res) => {
    try {
      const usuarios = await Usuario.findAll({
        include: [{ model: Assinatura, attributes: ["data_inicio", "data_fim"] }]
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

      const camposPermitidos = {
        nome: req.body.nome,
        email: req.body.email,
        telefone: req.body.telefone,
        cep: req.body.cep,
        endereco: req.body.endereco,
        numero: req.body.numero,
        estado: req.body.estado,
        bairro: req.body.bairro,
        data_nascimento: req.body.data_nascimento,
        profissao: req.body.profissao,
        renda: req.body.renda,
        celular: req.body.celular
      };

      const usuario = await Usuario.findByPk(id);
      if (!usuario)
        return res.status(404).json({ error: "Usuário não encontrado" });

      await usuario.update(camposPermitidos);

      res.json(usuario);

    } catch (error) {
      console.error("Erro atualizar:", error);
      res.status(500).json({ error: error.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id);
      if (!usuario)
        return res.status(404).json({ error: "Usuário não encontrado" });

      await usuario.destroy();

      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  alterarSenha: async (req, res) => {
    try {
      const { id } = req.params;
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha)
        return res.status(400).json({ msg: "Envie a senha atual e a nova senha." });

      const usuario = await Usuario.findByPk(id);
      if (!usuario)
        return res.status(404).json({ msg: "Usuário não encontrado." });

      const senhaConfere = await bcrypt.compare(senhaAtual, usuario.senha);
      if (!senhaConfere)
        return res.status(401).json({ msg: "Senha atual incorreta." });

      usuario.senha = await bcrypt.hash(novaSenha, 10);
      await usuario.save();

      res.json({ msg: "Senha alterada com sucesso!" });

    } catch (err) {
      console.error("Erro alterar senha:", err);
      res.status(500).json({ msg: "Erro interno." });
    }
  },

  verificarPremium: async (req, res) => {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(id, {
        include: [{ model: Assinatura, attributes: ["data_inicio", "data_fim"] }]
      });

      if (!usuario)
        return res.status(404).json({ error: "Usuário não encontrado" });

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
