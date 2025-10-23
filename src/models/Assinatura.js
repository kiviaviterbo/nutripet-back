import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.js";

const Assinatura = sequelize.define("Assinatura", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  data_inicio: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false
  },
  data_fim: {
    type: DataTypes.DATE,
    allowNull: true
  },
  forma_pagamento: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: "assinatura",
  timestamps: true
});

// Relacionamento com Usuario
Usuario.hasMany(Assinatura, { foreignKey: "usuario_id", onDelete: "CASCADE" });
Assinatura.belongsTo(Usuario, { foreignKey: "usuario_id" });


export default Assinatura;
