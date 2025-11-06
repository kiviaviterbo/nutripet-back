import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.js";

const Pet = sequelize.define("Pet", {
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
  raca: {
    type: DataTypes.STRING,
    allowNull: true
  },
  genero: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  idade: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  peso: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },
  imagem_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  
}, {
  tableName: "pet",
  timestamps: true
});

// Relacionamento com Usuario
Usuario.hasMany(Pet, { foreignKey: "usuario_id", onDelete: "CASCADE" });
Pet.belongsTo(Usuario, { foreignKey: "usuario_id" });

export default Pet;
