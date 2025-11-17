import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.js";
import Assinatura from "./Assinatura.js";

const Consulta = sequelize.define("Consulta", {

  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  assinatura_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  nome_pet: {
    type: DataTypes.STRING,
    allowNull: false
  },

  peso: {
    type: DataTypes.DECIMAL(5,2)
  },

  especie: {
    type: DataTypes.ENUM("canino", "felino")
  },

  raca: {
    type: DataTypes.STRING
  },

  genero: {
    type: DataTypes.ENUM("macho", "femea")
  },

  castrado: { type: DataTypes.BOOLEAN, defaultValue: false },
  filhote: { type: DataTypes.BOOLEAN, defaultValue: false },
  senior: { type: DataTypes.BOOLEAN, defaultValue: false },
  vacinado: { type: DataTypes.BOOLEAN, defaultValue: false },
  renal: { type: DataTypes.BOOLEAN, defaultValue: false },
  obesidade: { type: DataTypes.BOOLEAN, defaultValue: false },
  diabete: { type: DataTypes.BOOLEAN, defaultValue: false },
  doenca_carrapato: { type: DataTypes.BOOLEAN, defaultValue: false },
  sedentario: { type: DataTypes.BOOLEAN, defaultValue: false },
  convive_outros: { type: DataTypes.BOOLEAN, defaultValue: false },

  documento_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },

  status: {
    type: DataTypes.ENUM("pendente", "em_andamento", "finalizada", "cancelada"),
    defaultValue: "pendente"
  },

  data_solicitacao: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: "consultas",
  timestamps: true
});

Usuario.hasMany(Consulta, { foreignKey: "usuario_id", onDelete: "CASCADE" });
Consulta.belongsTo(Usuario, { foreignKey: "usuario_id" });

Assinatura.hasMany(Consulta, { foreignKey: "assinatura_id", onDelete: "CASCADE" });
Consulta.belongsTo(Assinatura, { foreignKey: "assinatura_id" });

export default Consulta;
