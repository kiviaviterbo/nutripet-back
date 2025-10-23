import Assinatura from "../models/Assinatura.js";
import Usuario from "../models/Usuario.js";

const assinaturaController = {

  criar: async (req, res) => {
    try {
      const { usuario_id, data_inicio, data_fim, forma_pagamento } = req.body;
      // Verifica se o usuário existe
      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

      const assinatura = await Assinatura.create({ usuario_id, data_inicio, data_fim, forma_pagamento });
      res.status(201).json(assinatura);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const assinaturas = await Assinatura.findAll({ include: Usuario });
      res.json(assinaturas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorUsuario: async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const assinaturas = await Assinatura.findAll({ 
        where: { usuario_id },
        include: Usuario
      });
      res.json(assinaturas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const assinatura = await Assinatura.findByPk(id);
      if (!assinatura) return res.status(404).json({ error: "Assinatura não encontrada" });
      await assinatura.update(req.body);
      res.json(assinatura);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const assinatura = await Assinatura.findByPk(id);
      if (!assinatura) return res.status(404).json({ error: "Assinatura não encontrada" });
      await assinatura.destroy();
      res.json({ message: "Assinatura deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

export default assinaturaController;
