import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Usuario = sequelize.define("Usuario", {
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cep: {
    type: DataTypes.STRING(9),
    allowNull: true,
  },
  endereco: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  numero: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  estado: {
    type: DataTypes.STRING(2),
    allowNull: true,
  },
  bairro: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  profissao: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  renda: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },

  celular: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  plano: {
    type: DataTypes.ENUM('free', 'premium'),
    defaultValue: 'free'
  },
  premium_expira_em: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: "usuario",
  timestamps: true
});

export default Usuario;
