import { Op, fn, col, where } from "sequelize";
import TabelaNutricional from "../models/TabelaNutricional.js";

const tabelaController = {
  criar: async (req, res) => {
    try {
      const dados = req.body;
      const imagemUrl = req.file ? req.file.path : null; 

      const tabela = await TabelaNutricional.create({
        ...dados,
        imagem_url: imagemUrl, 
      });

      res.status(201).json(tabela);
    } catch (error) {
      console.error("Erro ao criar tabela:", error);
      res.status(500).json({ error: error.message });
    }
  },

  listar: async (req, res) => {
    try {
      const { nome } = req.query;

      let condition = {};
      if (nome) {
        condition = where(fn("LOWER", col("nome")), {
          [Op.like]: `%${nome.toLowerCase()}%`,
        });
      }

      const tabelas = await TabelaNutricional.findAll({
        where: nome ? condition : {},
        order: [["nome", "ASC"]],
      });

      const tabelasComImagem = tabelas.map((item) => {
        const data = item.toJSON();
        return {
          ...data,
          imagem_url: data.imagem_url || null,
        };
      });

      res.json(tabelasComImagem);
    } catch (error) {
      console.error("Erro ao listar tabelas:", error);
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const tabela = await TabelaNutricional.findByPk(id);
      if (!tabela)
        return res
          .status(404)
          .json({ error: "Tabela nutricional não encontrada" });
      res.json(tabela);
    } catch (error) {
      console.error("Erro ao buscar tabela:", error);
      res.status(500).json({ error: error.message });
    }
  },

  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const tabela = await TabelaNutricional.findByPk(id);
      if (!tabela)
        return res
          .status(404)
          .json({ error: "Tabela nutricional não encontrada" });

      const imagemUrl = req.file ? req.file.path : tabela.imagem_url;

      await tabela.update({
        ...req.body,
        imagem_url: imagemUrl,
      });

      res.json(tabela);
    } catch (error) {
      console.error("Erro ao atualizar tabela:", error);
      res.status(500).json({ error: error.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const tabela = await TabelaNutricional.findByPk(id);
      if (!tabela)
        return res
          .status(404)
          .json({ error: "Tabela nutricional não encontrada" });

      await tabela.destroy();
      res.json({ message: "Tabela deletada com sucesso" });
    } catch (error) {
      console.error("Erro ao deletar tabela:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default tabelaController;
