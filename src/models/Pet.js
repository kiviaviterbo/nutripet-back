import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Usuario from "./Usuario.js";

const Pet = sequelize.define(
  "Pet",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    especie: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    raca: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    genero: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    idade: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    peso: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },
    imagem_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "usuario", 
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "pet",
    timestamps: true,
  //  underscored: true, 
  }
);

Usuario.hasMany(Pet, {
  foreignKey: "usuario_id",
  as: "pets",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Pet.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

export default Pet;
