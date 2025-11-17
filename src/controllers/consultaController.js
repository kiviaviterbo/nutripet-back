import Assinatura from "../models/Assinatura.js";
import Consulta from "../models/Consulta.js";
import cloudinary from "../config/cloudinaryConfig.js";
import { Op } from "sequelize";

const consultaController = {

  criar: async (req, res) => {
    try {
      const {
        usuario_id,
        nome_pet,
        peso,
        especie,
        raca,
        genero,
        castrado,
        senior,
        filhote,
        vacinado,
        renal,
        obesidade,
        diabete,
        doenca_carrapato,
        sedentario,
        convive_outros
      } = req.body;

      const assinaturaAtiva = await Assinatura.findOne({
        where: {
          usuario_id,
          status: "ativo",
          data_inicio: { [Op.lte]: new Date() },
          data_fim: { [Op.gte]: new Date() }
        }
      });

      if (!assinaturaAtiva) {
        return res.status(403).json({ msg: "Você não possui uma assinatura premium ativa." });
      }
      const totalConsultas = await Consulta.count({
        where: {
          usuario_id,
          assinatura_id: assinaturaAtiva.id,
          data_solicitacao: {
            [Op.between]: [assinaturaAtiva.data_inicio, assinaturaAtiva.data_fim]
          }
        }
      });

      if (totalConsultas >= 2) {
        return res.status(403).json({
          msg: "Limite de 2 consultas neste período já foi atingido."
        });
      }

      let documento_url = null;

      if (req.file) {
        const pdfHeader = req.file.buffer.subarray(0, 5).toString();
        if (!pdfHeader.includes("%PDF-")) {
          return res.status(400).json({ msg: "O arquivo enviado não é um PDF válido." });
        }

        const uploadPdf = () => {
          return new Promise((resolve, reject) => {
            const publicId = `consulta_${Date.now()}.pdf`;

            const stream = cloudinary.uploader.upload_stream(
              {
                folder: "consultas",
                resource_type: "raw",
                public_id: publicId
              },
              (error, result) => {
                if (error) {
                  console.error("Erro Cloudinary:", error);
                  return reject(error);
                }
                resolve(result);
              }
            );

            stream.end(req.file.buffer);
          });
        };

        const pdfUpload = await uploadPdf();
        documento_url = pdfUpload.secure_url;
      }
      const consulta = await Consulta.create({
        usuario_id,
        assinatura_id: assinaturaAtiva.id,

        nome_pet,
        peso,
        especie,
        raca,
        genero,

        castrado: castrado === "true" || castrado === true,
        senior: senior === "true" || senior === true,
        filhote: filhote === "true" || filhote === true,
        vacinado: vacinado === "true" || vacinado === true,
        renal: renal === "true" || renal === true,
        obesidade: obesidade === "true" || obesidade === true,
        diabete: diabete === "true" || diabete === true,
        doenca_carrapato: doenca_carrapato === "true" || doenca_carrapato === true,
        sedentario: sedentario === "true" || sedentario === true,
        convive_outros: convive_outros === "true" || convive_outros === true,

        documento_url,
        status: "finalizada"
      });

      return res.json(consulta);

    } catch (error) {
      console.error("ERRO AO CRIAR CONSULTA:", error);
      return res.status(500).json({ msg: "Erro interno ao criar consulta." });
    }
  },

  listarPorUsuario: async (req, res) => {
    try {
      const { usuario_id } = req.params;

      const consultas = await Consulta.findAll({
        where: { usuario_id },
        order: [["createdAt", "DESC"]]
      });

      return res.json(consultas);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro ao buscar consultas." });
    }
  },

  cancelar: async (req, res) => {
    try {
      const { id } = req.params;

      const consulta = await Consulta.findByPk(id);
      if (!consulta) {
        return res.status(404).json({ msg: "Consulta não encontrada." });
      }

      consulta.status = "cancelada";
      await consulta.save();

      return res.json({ msg: "Consulta cancelada com sucesso." });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ msg: "Erro ao cancelar consulta." });
    }
  }
};

export default consultaController;
