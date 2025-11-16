export const detectUnit = (s = "") => {
  const v = String(s).toLowerCase();
  if (v.includes("mg/kg")) return "mg/kg";
  if (v.includes("g/kg")) return "g/kg";
  if (v.includes("%")) return "%";
  return "raw";
};

export const extractNumber = (s) => {
  if (s === null || s === undefined) return null;
  const num = String(s).replace(",", ".").match(/-?\d+(\.\d+)?/);
  return num ? parseFloat(num[0]) : null;
};

export const toUnit = (value, from, to) => {
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

export const toPercent = (fieldValue) => {
  const from = detectUnit(fieldValue);
  const v = extractNumber(fieldValue);
  if (v === null) return 0;
  return toUnit(v, from, "%") ?? 0;
};

export const regras = {
  proteina_bruta: { nome: "Proteína Bruta (mín.)", unidade: "%", tipo: "maior", bom: 35, medio: 30 },
  extrato_etereo: { nome: "Extrato Etéreo (mín.)", unidade: "%", tipo: "maior", bom: 10, medio: 8 },
  materia_fibrosa: { nome: "Matéria Fibrosa (máx.)", unidade: "g/kg", tipo: "menor", bom: 35, medio: 40 },
  materia_mineral: { nome: "Matéria Mineral (máx.)", unidade: "g/kg", tipo: "menor", bom: 90, medio: 100 },
  calcio: { nome: "Cálcio (mín.)", unidade: "mg/kg", tipo: "maior", bom: 12000, medio: 10000 },
  fosforo: { nome: "Fósforo (mín.)", unidade: "mg/kg", tipo: "maior", bom: 8000, medio: 7000 },
  sodio: { nome: "Sódio (mín.)", unidade: "mg/kg", tipo: "maior", bom: 5000, medio: 4000 },
  potassio: { nome: "Potássio (mín.)", unidade: "mg/kg", tipo: "maior", bom: 6000, medio: 5000 },
  taurina: { nome: "Taurina (mín.)", unidade: "mg/kg", tipo: "maior", bom: 1000, medio: 800 },
  umidade: { nome: "Umidade (máx.)", unidade: "%", tipo: "menor", bom: 12, medio: 14 },
};

export const calcularQualidade = (valor, regra) => {
  if (!regra || isNaN(valor)) return "indefinido";
  if (regra.tipo === "maior") {
    if (valor >= regra.bom) return "bom";
    if (valor >= regra.medio) return "medio";
    return "ruim";
  } else {
    if (valor <= regra.bom) return "bom";
    if (valor <= regra.medio) return "medio";
    return "ruim";
  }
};
