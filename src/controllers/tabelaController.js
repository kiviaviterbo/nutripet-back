import TabelaNutricional from "../models/TabelaNutricional.js";

const tabelaController = {

  criar: async (req, res) => {
    try {
      const tabela = await TabelaNutricional.create(req.body);
      res.status(201).json(tabela);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const tabelas = await TabelaNutricional.findAll();
      res.json(tabelas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const tabela = await TabelaNutricional.findByPk(id);
      if (!tabela) return res.status(404).json({ error: "Tabela nutricional não encontrada" });
      res.json(tabela);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const tabela = await TabelaNutricional.findByPk(id);
      if (!tabela) return res.status(404).json({ error: "Tabela nutricional não encontrada" });
      await tabela.update(req.body);
      res.json(tabela);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const tabela = await TabelaNutricional.findByPk(id);
      if (!tabela) return res.status(404).json({ error: "Tabela nutricional não encontrada" });
      await tabela.destroy();
      res.json({ message: "Tabela deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

};

export default tabelaController;
