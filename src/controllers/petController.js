import Pet from "../models/Pet.js";
import Usuario from "../models/Usuario.js";

const petController = {

  criar: async (req, res) => {
    try {
      const { nome, especie, raca, idade, peso, usuario_id } = req.body;
      // Verifica se usuário existe
      const usuario = await Usuario.findByPk(usuario_id);
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

      const pet = await Pet.create({ nome, especie, raca, idade, peso, usuario_id });
      res.status(201).json(pet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const pets = await Pet.findAll({ include: Usuario });
      res.json(pets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const pet = await Pet.findByPk(id, { include: Usuario });
      if (!pet) return res.status(404).json({ error: "Pet não encontrado" });
      res.json(pet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, especie, raca, idade, peso } = req.body;
      const pet = await Pet.findByPk(id);
      if (!pet) return res.status(404).json({ error: "Pet não encontrado" });
      await pet.update({ nome, especie, raca, idade, peso });
      res.json(pet);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const pet = await Pet.findByPk(id);
      if (!pet) return res.status(404).json({ error: "Pet não encontrado" });
      await pet.destroy();
      res.json({ message: "Pet deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

export default petController;
