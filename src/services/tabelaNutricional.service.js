import TabelaNutricional from "../models/TabelaNutricional.js";
import {
  detectUnit,
  extractNumber,
  toUnit,
  toPercent,
  calcularQualidade,
  regras,
} from "../utils/tabelaUtils.js";

/** Fração de Matéria Seca */
const calcularMS = (umidadePct) => {
  const u = Number(umidadePct);
  if (!isFinite(u)) return null;
  const ms = 1 - u / 100;
  return ms > 0 && ms < 1 ? ms : null;
};
/** Classificação Proteína */
const classificarProteina = (pbDMB, especie, ehUmida) => {
  if (ehUmida) {
    if (pbDMB >= 8) return "bom";
    if (pbDMB >= 6) return "medio";
    return "ruim";
  }

  if (especie === "felino") {
    if (pbDMB >= 35) return "bom";
    if (pbDMB >= 30) return "medio";
    return "ruim";
  }

  if (especie === "canino") {
    // 🔹 Ajuste mais realista para cães adultos e super premium
    if (pbDMB >= 26) return "bom";   // excelente proteína
    if (pbDMB >= 22) return "medio"; // aceitável
    return "ruim";                   // abaixo do ideal
  }

  return "indefinido";
};

/** Classificação Carboidrato */
const classificarCarbo = (carbDMB, especie, ehUmida) => {
  if (ehUmida) {
    if (carbDMB <= 15) return "bom";
    if (carbDMB <= 30) return "medio";
    return "ruim";
  }

  if (especie === "felino") {
    if (carbDMB <= 35) return "bom";
    if (carbDMB <= 40) return "medio";
    return "ruim";
  }

  if (especie === "canino") {
    // 🔹 Cães toleram mais carbo que gatos, então expandimos o limite
    if (carbDMB <= 45) return "bom";   // dentro da faixa ideal
    if (carbDMB <= 50) return "medio"; // limite aceitável
    return "ruim";                     // acima disso é exagerado
  }

  return "indefinido";
};


/* const classificarProteina = (pbDMB, especie, ehUmida) => {
  if (ehUmida) {
    if (pbDMB >= 8) return "bom";
    if (pbDMB >= 6) return "medio";
    return "ruim";
  }
  if (especie === "felino") {
    if (pbDMB >= 35) return "bom";
    if (pbDMB >= 30) return "medio";
    return "ruim";
  }
  if (especie === "canino") {
    if (pbDMB >= 25) return "bom";
    if (pbDMB >= 21) return "medio";
    return "ruim";
  }
  return "indefinido";
};


const classificarCarbo = (carbDMB, especie, ehUmida) => {
  if (ehUmida) {
    if (carbDMB <= 15) return "bom";
    if (carbDMB <= 30) return "medio";
    return "ruim";
  }
  if (especie === "felino") {
    if (carbDMB <= 35.5) return "bom";
    if (carbDMB <= 40) return "medio";
    return "ruim";
  }
  if (especie === "canino") {
    if (carbDMB <= 32) return "bom";
    if (carbDMB <= 38) return "medio";
    return "ruim";
  }
  return "indefinido";
}; */

const service = {
  async buscarPorId(id) {
    const tabela = await TabelaNutricional.findByPk(id);
    if (!tabela) throw new Error("Tabela nutricional não encontrada");

    const tipoRacao = (tabela.tipo || "").trim();
    const ehUmida = /úmida|umida/i.test(tipoRacao);
    const especie = (tabela.especie || "").toLowerCase();

    // === Valores "as fed" (%)
    const umidadePct = toPercent(tabela.umidade);
    const pbPct = toPercent(tabela.proteina_bruta);
    const eePct = toPercent(tabela.extrato_etereo);
    const fbPct = toPercent(tabela.materia_fibrosa);
    const mmPct = toPercent(tabela.materia_mineral);

    // === Cálculo do carboidrato (ENN)
    let carboAsFed = 100 - (umidadePct + pbPct + eePct + fbPct + mmPct);
    if (carboAsFed < 0) carboAsFed = 0;

    // 🔹 Ajuste de limites realistas
    if (ehUmida) {
      // ração úmida nunca tem carbo alto — corta o exagero
      if (carboAsFed > 20) carboAsFed = 20;
    } else {
      // seca pode ter até 50–55%
      if (carboAsFed > 55) carboAsFed = 55;
    }

    // === Matéria seca
    const MS = calcularMS(umidadePct);

    const pbDMB = MS ? pbPct / MS : pbPct;
    const eeDMB = MS ? eePct / MS : eePct;
    const carbDMB = MS ? carboAsFed / MS : carboAsFed;

    const protQualidade = classificarProteina(pbDMB, especie, ehUmida);
    const carbQualidade = classificarCarbo(carbDMB, especie, ehUmida);

    // === Corante
    const corante = tabela.corante_artificial
      ? "Contém corante artificial"
      : "Sem corante artificial";
    const coranteQualidade = tabela.corante_artificial ? "ruim" : "bom";

    // === Tabela detalhada (seca e úmida)
    const nutrientes = Object.entries(regras)
      .map(([campo, regra]) => {
        const raw = tabela[campo];
        if (!raw) return null;

        const num = extractNumber(raw);
        const unidadeOrig = detectUnit(raw);
        let valor = toUnit(num, unidadeOrig, regra.unidade);

        // Se for úmida, converte para base seca (DMB)
        let valorParaComparar = valor;
        if (MS && campo !== "umidade") valorParaComparar = valor / MS;

        // Formatação de exibição
        let valorExibir;
        if (regra.unidade === "%") {
          valorExibir = `${valorParaComparar.toFixed(1)}%${ehUmida ? " (DMB)" : ""}`;
        } else if (regra.unidade === "mg/kg") {
          valorExibir = `${Math.round(valorParaComparar).toLocaleString()} mg/kg${ehUmida ? " (DMB)" : ""
            }`;
        } else if (regra.unidade === "g/kg") {
          valorExibir = `${valorParaComparar.toFixed(1)} g/kg${ehUmida ? " (DMB)" : ""}`;
        } else {
          valorExibir = `${valorParaComparar}`;
        }

        let qualidade;

        if (campo === "proteina_bruta") {
          qualidade = classificarProteina(valorParaComparar, especie, ehUmida);
        } else if (campo === "carboidrato") {
          qualidade = classificarCarbo(valorParaComparar, especie, ehUmida);
        } else {
          qualidade = calcularQualidade(valorParaComparar, regra);
        }

        return {
          nome: regra.nome,
          valor: valorExibir,
          qualidade,
        };
      })
      .filter(Boolean);

    // === Retorno completo
    return {
      ...tabela.toJSON(),
      ehUmida,
      pbDMB,
      eeDMB,
      carbDMB,
      carboidrato: carboAsFed,
      nutrientes,
      avaliacaoNutricional: [
        { nome: "Proteína Bruta", valor: `${pbDMB.toFixed(1)}% (DMB)`, qualidade: protQualidade },
        { nome: "Carboidrato (ENN)", valor: `${carbDMB.toFixed(1)}% (DMB)`, qualidade: carbQualidade },
        { nome: "Corante Artificial", valor: corante, qualidade: coranteQualidade },
      ],
    };
  },
};

export default service;
