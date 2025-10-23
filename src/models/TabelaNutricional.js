import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const TabelaNutricional = sequelize.define("TabelaNutricional", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  especie: {
    type: DataTypes.STRING,
    allowNull: false
  },
  proteina_bruta: DataTypes.STRING,
  extrato_etereo: DataTypes.STRING,
  materia_fibrosa: DataTypes.STRING,
  materia_mineral: DataTypes.STRING,
  calcio: DataTypes.STRING,
  fosforo: DataTypes.STRING,
  sodio: DataTypes.STRING,
  potassio: DataTypes.STRING,
  taurina: DataTypes.STRING,
  l_carnitina: DataTypes.STRING,
  dl_metionina: DataTypes.STRING,
  magnesio: DataTypes.STRING,
  omega_6: DataTypes.STRING,
  omega_3: DataTypes.STRING,
  mananoligossacarideo: DataTypes.STRING,
  umidade: DataTypes.STRING,
  ph_urinario: DataTypes.STRING
}, {
  tableName: "tabelanutricional",
  timestamps: true
});

export default TabelaNutricional;
