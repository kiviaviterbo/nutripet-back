import Pet from "../models/Pet.js";
import Usuario from "../models/Usuario.js";

const petController = {
  criar: async (req, res) => {
    try {
      const { nome, especie, raca, idade, peso, genero, imagem_url } = req.body;
      const usuarioId = req.user.id; 

      const usuario = await Usuario.findByPk(usuarioId);
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado." });

      const pet = await Pet.create({
        nome,
        especie,
        raca,
        idade,
        peso,
        genero,
        usuario_id: usuarioId,
        imagem_url,
      });

      return res.status(201).json(pet);
    } catch (error) {
      console.error("Erro ao criar pet:", error);
      return res.status(500).json({ error: "Erro ao criar pet." });
    }
  },

  listar: async (req, res) => {
    try {
      const usuarioId = req.user.id;
      const pets = await Pet.findAll({
        where: { usuario_id: usuarioId },
        order: [["id", "DESC"]],
      });
      return res.json(pets);
    } catch (error) {
      console.error("Erro ao listar pets:", error);
      return res.status(500).json({ error: "Erro ao listar pets." });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;

      const pet = await Pet.findOne({
        where: { id, usuario_id: usuarioId },
      });

      if (!pet) return res.status(404).json({ error: "Pet não encontrado." });
      return res.json(pet);
    } catch (error) {
      console.error("Erro ao buscar pet:", error);
      return res.status(500).json({ error: "Erro ao buscar pet." });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;
      const { nome, especie, raca, idade, peso, genero, imagem_url } = req.body;

      const pet = await Pet.findOne({
        where: { id, usuario_id: usuarioId },
      });

      if (!pet)
        return res.status(404).json({ error: "Pet não encontrado ou não pertence a este usuário." });

      await pet.update({ nome, especie, raca, idade, peso, genero, imagem_url });
      return res.json(pet);
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      return res.status(500).json({ error: "Erro ao atualizar pet." });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const usuarioId = req.user.id;

      const pet = await Pet.findOne({
        where: { id, usuario_id: usuarioId },
      });

      if (!pet)
        return res.status(404).json({ error: "Pet não encontrado ou não pertence a este usuário." });

      await pet.destroy();
      return res.json({ message: "Pet deletado com sucesso." });
    } catch (error) {
      console.error("Erro ao deletar pet:", error);
      return res.status(500).json({ error: "Erro ao deletar pet." });
    }
  },
};

export default petController;
