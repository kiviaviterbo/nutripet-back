import { Op } from "sequelize";
import TabelaNutricional from "../models/TabelaNutricional.js";

const detectUnit = (s = "") => {
  const v = String(s).toLowerCase();
  if (v.includes("mg/kg")) return "mg/kg";
  if (v.includes("g/kg")) return "g/kg";
  if (v.includes("%")) return "%";
  return "raw";
};

const extractNumber = (s) => {
  if (s === null || s === undefined) return null;
  const num = String(s).replace(",", ".").match(/-?\d+(\.\d+)?/);
  return num ? parseFloat(num[0]) : null;
};

const toUnit = (value, from, to) => {
  if (value === null || isNaN(value)) return null;
  if (from === to) return value;

  if (from === "%" && to === "g/kg") return value * 10;
  if (from === "g/kg" && to === "%") return value / 10;

  if (from === "%" && to === "mg/kg") return value * 10000;
  if (from === "mg/kg" && to === "%") return value / 10000;

  if (from === "g/kg" && to === "mg/kg") return value * 1000;
  if (from === "mg/kg" && to === "g/kg") return value / 1000;

  if (from === "raw") return value;

  return null;
};

const toPercent = (fieldValue) => {
  const from = detectUnit(fieldValue);
  const v = extractNumber(fieldValue);
  if (v === null) return 0;
  return toUnit(v, from, "%") ?? 0;
};
const regras = {
  proteina_bruta: {
    nome: "Proteína Bruta (mín.)",
    unidade: "g/kg",
    tipo: "maior",
    bom: 350,
    medio: 340,
  },
  extrato_etereo: {
    nome: "Extrato Etéreo (mín.)",
    unidade: "g/kg",
    tipo: "maior",
    bom: 90,
    medio: 80,
  },
  materia_fibrosa: {
    nome: "Matéria Fibrosa (máx.)",
    unidade: "g/kg",
    tipo: "menor",
    bom: 35,
    medio: 40,
  },
  materia_mineral: {
    nome: "Matéria Mineral (máx.)",
    unidade: "g/kg",
    tipo: "menor",
    bom: 90,
    medio: 100,
  },
  calcio: {
    nome: "Cálcio (mín.)",
    unidade: "mg/kg",
    tipo: "maior",
    bom: 12000,
    medio: 10000,
  },
  fosforo: {
    nome: "Fósforo (mín.)",
    unidade: "mg/kg",
    tipo: "maior",
    bom: 8000,
    medio: 7000,
  },
  sodio: {
    nome: "Sódio (mín.)",
    unidade: "mg/kg",
    tipo: "maior",
    bom: 5000,
    medio: 4000,
  },
  potassio: {
    nome: "Potássio (mín.)",
    unidade: "mg/kg",
    tipo: "maior",
    bom: 6000,
    medio: 5000,
  },
  taurina: {
    nome: "Taurina (mín.)",
    unidade: "mg/kg",
    tipo: "maior",
    bom: 1000,
    medio: 800,
  },
  umidade: {
    nome: "Umidade (máx.)",
    unidade: "%",
    tipo: "menor",
    bom: 12,
    medio: 14,
  },
};

function calcularQualidade(valor, regra) {
  if (!regra || isNaN(valor)) return "indefinido";

  if (regra.tipo === "maior") {
    if (valor >= regra.bom) return "bom";
    if (valor >= regra.medio) return "medio";
    return "ruim";
  } else {
    // tipo menor
    if (valor <= regra.bom) return "bom";
    if (valor <= regra.medio) return "medio";
    return "ruim";
  }
}

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
          [Op.or]: marcas.map((m) => ({
            marca: { [Op.like]: `%${m}%` },
          })),
        });

      const tipos = splitList(tipo);
      if (tipos.length)
        andConds.push({
          [Op.or]: tipos.map((t) => ({
            tipo: { [Op.like]: `%${t}%` },
          })),
        });

      const especies = splitList(especie);
      if (especies.length)
        andConds.push({
          [Op.or]: especies.map((e) => ({
            especie: { [Op.like]: `%${e}%` },
          })),
        });

      const variacoes = splitList(variacao);
      if (variacoes.length)
        andConds.push({
          [Op.or]: variacoes.map((v) => ({
            variacao: { [Op.like]: `%${v}%` },
          })),
        });

      const where = andConds.length ? { [Op.and]: andConds } : {};

      const tabelas = await TabelaNutricional.findAll({
        where,
        order: [["nome", "ASC"]],
      });

      const resultado = tabelas.map((t) => ({
        ...t.toJSON(),
        imagem_url: t.imagem_url || null,
      }));

      res.json(resultado);
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

      const marcas = [...new Set(tabelas.map((t) => t.marca).filter(Boolean))];
      const tipos = [...new Set(tabelas.map((t) => t.tipo).filter(Boolean))];
      const especies = [...new Set(tabelas.map((t) => t.especie).filter(Boolean))];
      const variacoes = [...new Set(tabelas.map((t) => t.variacao).filter(Boolean))];

      res.json({ marcas, tipos, especies, variacoes });
    } catch (error) {
      console.error("❌ Erro ao listar filtros:", error);
      res.status(500).json({ error: error.message });
    }
  },

  // === BUSCAR POR ID ===
  // ==========================================================
  // 🔹 BUSCAR POR ID (com cálculo completo e avaliações)
  // ==========================================================
  buscarPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const tabela = await TabelaNutricional.findByPk(id);

      if (!tabela) {
        return res
          .status(404)
          .json({ error: "Tabela nutricional não encontrada" });
      }

      // --- Monta tabela nutricional completa ---
      const nutrientes = Object.entries(regras)
        .map(([campo, regra]) => {
          const original = tabela[campo];
          if (!original) return null;

          const from = detectUnit(original);
          const raw = extractNumber(original);
          if (raw === null) {
            return {
              nome: regra.nome,
              valor: String(original),
              qualidade: "indefinido",
            };
          }

          const valorParaComparar = toUnit(raw, from, regra.unidade);
          const qualidade = calcularQualidade(valorParaComparar, regra);
          const valorExibir = String(original).trim();

          return {
            nome: regra.nome,
            valor: valorExibir,
            qualidade,
          };
        })
        .filter(Boolean);

      // --- Normaliza espécie ---
      const especie = (tabela.especie || "").toLowerCase();

      // --- Converte nutrientes para percentual (%)
      const umidade = toPercent(tabela.umidade);
      const pbPct = toPercent(tabela.proteina_bruta);
      const eePct = toPercent(tabela.extrato_etereo);
      const fbPct = toPercent(tabela.materia_fibrosa);
      const mmPct = toPercent(tabela.materia_mineral);

      // --- Cálculo correto do ENN (%)
      let carboidrato = 100 - (umidade + pbPct + eePct + fbPct + mmPct);
      if (!isFinite(carboidrato)) carboidrato = 0;
      carboidrato = Math.max(0, Math.min(100, carboidrato));

      // --- Avaliação de Carboidrato ---
      let carbQualidade = "medio";
      if (especie === "felino") {
        if (carboidrato <= 35.5) carbQualidade = "bom";
        else if (carboidrato <= 40) carbQualidade = "medio";
        else carbQualidade = "ruim";
      } else if (especie === "canino") {
        if (carboidrato <= 32) carbQualidade = "bom";
        else if (carboidrato <= 38) carbQualidade = "medio";
        else carbQualidade = "ruim";
      }

      // --- Avaliação de Proteína Bruta ---
      let protQualidade = "medio";
      if (especie === "felino") {
        if (pbPct >= 35) protQualidade = "bom";
        else if (pbPct >= 30) protQualidade = "medio";
        else protQualidade = "ruim";
      } else if (especie === "canino") {
        if (pbPct >= 25) protQualidade = "bom";
        else if (pbPct >= 21) protQualidade = "medio";
        else protQualidade = "ruim";
      }

      // --- Avaliação de Corante Artificial ---
      const corante = tabela.corante_artificial;
      let coranteQualidade = "medio";
      let coranteDescricao = "Indefinido";
      if (corante === false || corante === 0 || corante === null) {
        coranteQualidade = "bom";
        coranteDescricao = "Sem corante artificial";
      } else if (corante === true || corante === 1) {
        coranteQualidade = "ruim";
        coranteDescricao = "Contém corante artificial";
      }

      // --- Monta resultado da avaliação ---
      const avaliacaoNutricional = [
        {
          nome: "Proteína Bruta",
          valor: `${pbPct.toFixed(1)}%`,
          qualidade: protQualidade,
        },
        {
          nome: "Carboidrato (ENN)",
          valor: `${carboidrato.toFixed(1)}%`,
          qualidade: carbQualidade,
        },
        {
          nome: "Corante Artificial",
          valor: coranteDescricao,
          qualidade: coranteQualidade,
        },
      ];

      // --- Retorna resposta final ---
      res.json({
        ...tabela.toJSON(),
        carboidrato: carboidrato,
        nutrientes,
        avaliacaoNutricional,
      });
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
        return res
          .status(404)
          .json({ error: "Tabela nutricional não encontrada" });

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
        return res
          .status(404)
          .json({ error: "Tabela nutricional não encontrada" });
      await tabela.destroy();
      res.json({ message: "Tabela deletada com sucesso" });
    } catch (error) {
      console.error("❌ Erro ao deletar tabela:", error);
      res.status(500).json({ error: error.message });
    }
  },
};

export default tabelaController;
