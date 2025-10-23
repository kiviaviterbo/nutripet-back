import Usuario from "../models/Usuario.js";
import Assinatura from "../models/Assinatura.js";

const usuarioController = {

  criar: async (req, res) => {
    try {
      const { nome, email, senha, telefone } = req.body;
      const usuario = await Usuario.create({ nome, email, senha, telefone });
      res.status(201).json(usuario);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
