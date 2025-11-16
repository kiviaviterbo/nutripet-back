import { Op } from "sequelize";
import TabelaNutricional from "../models/TabelaNutricional.js";
import tabelaService from "../services/tabelaNutricional.service.js";

const splitList = (v) => {
  if (!v) return [];
  if (Array.isArray(v))
    return v.filter(Boolean).map(String).map((s) => s.trim()).filter(Boolean);
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const tabelaController = {
  // === CRIAR NOVA RAÇÃO ===
  criar: async (req, res) => {
    try {
      const dados = req.body;
      const imagemUrl = req.file ? req.file.path : dados.imagem_url || null;

      const tabela = await TabelaNutricional.create({
        ...dados,
        imagem_url: imagemUrl,
      });

      res.status(201).json(tabela);
    } catch (error) {
      console.error("❌ Erro ao criar tabela:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // === LISTAR ===
  listar: async (req, res) => {
    try {
      const { nome, marca, tipo, especie, variacao } = req.query;
      const andConds = [];

      if (nome && String(nome).trim()) {
        const termo = `%${String(nome).trim()}%`;
        andConds.push({
          [Op.or]: [
            { nome: { [Op.like]: termo } },
            { marca: { [Op.like]: termo } },
            { tipo: { [Op.like]: termo } },
            { especie: { [Op.like]: termo } },
            { variacao: { [Op.like]: termo } },
          ],
        });
      }

      const marcas = splitList(marca);
      if (marcas.length)
        andConds.push({
          [Op.or]: marcas.map((m) => ({ marca: { [Op.like]: `%${m}%` } })),
        });

      const tipos = splitList(tipo);
      if (tipos.length)
        andConds.push({
          [Op.or]: tipos.map((t) => ({ tipo: { [Op.like]: `%${t}%` } })),
        });

      const especies = splitList(especie);
      if (especies.length)
        andConds.push({
          [Op.or]: especies.map((e) => ({ especie: { [Op.like]: `%${e}%` } })),
        });

      const variacoes = splitList(variacao);
      if (variacoes.length)
        andConds.push({
          [Op.or]: variacoes.map((v) => ({ variacao: { [Op.like]: `%${v}%` } })),
        });

      const where = andConds.length ? { [Op.and]: andConds } : {};

      const tabelas = await TabelaNutricional.findAll({
        where,
        order: [["nome", "ASC"]],
      });

      res.json(
        tabelas.map((t) => ({
          ...t.toJSON(),
          imagem_url: t.imagem_url || null,
        }))
      );
    } catch (error) {
      console.error("❌ Erro ao listar tabelas:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // === FILTROS ===
  filtros: async (req, res) => {
    try {
      const tabelas = await TabelaNutricional.findAll({
        attributes: ["marca", "tipo", "especie", "variacao"],
      });

      res.json({
        marcas: [...new Set(tabelas.map((t) => t.marca).filter(Boolean))],
        tipos: [...new Set(tabelas.map((t) => t.tipo).filter(Boolean))],
        especies: [...new Set(tabelas.map((t) => t.especie).filter(Boolean))],
        variacoes: [...new Set(tabelas.map((t) => t.variacao).filter(Boolean))],
      });
    } catch (error) {
      console.error("❌ Erro ao listar filtros:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // === BUSCAR POR ID (agora usando o SERVICE) ===
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const payload = await tabelaService.buscarPorId(id);
      res.json(payload);
    } catch (error) {
      console.error("❌ Erro ao buscar tabela:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // === ATUALIZAR ===
  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const tabela = await TabelaNutricional.findByPk(id);

      if (!tabela)
        return res.status(404).json({ error: "Tabela nutricional não encontrada" });

      const imagemUrl = req.file ? req.file.path : tabela.imagem_url;
      await tabela.update({ ...req.body, imagem_url: imagemUrl });

      res.json(tabela);
    } catch (error) {
      console.error("❌ Erro ao atualizar tabela:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // === DELETAR ===
  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const tabela = await TabelaNutricional.findByPk(id);

      if (!tabela)
        return res.status(404).json({ error: "Tabela nutricional não encontrada" });

      await tabela.destroy();
      res.json({ message: "Tabela deletada com sucesso" });
    } catch (error) {
      console.error("❌ Erro ao deletar tabela:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default tabelaController;
