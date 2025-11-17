import Assinatura from "../models/Assinatura.js";
import Consulta from "../models/Consulta.js";
import Usuario from "../models/Usuario.js";
import { v4 as uuidv4 } from "uuid";

const assinaturaController = {

  criarAssinatura: async (req, res) => {
    try {
      const { userId, metodo } = req.body;
      const user = await Usuario.findByPk(userId);
      if (!user) return res.status(404).json({ error: "Usuário não encontrado" });

      const payment_subscription_id = `demo_${uuidv4()}`;
      const now = new Date();

      const assinatura = await Assinatura.create({
        usuario_id: user.id,
        payment_subscription_id,
        status: "pendente",
        valor: 149.7,
        data_inicio: now,
        data_fim: null,
        forma_pagamento: metodo || "cartao",
      });

      const checkoutUrl = `${
        process.env.FRONTEND_URL || "http://localhost:3000"
      }/fake-checkout/${payment_subscription_id}?metodo=${metodo || "card"}`;

      return res.json({
        subscriptionId: payment_subscription_id,
        checkoutUrl,
        message: "Checkout fictício criado. Simule o pagamento no front-end.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao criar assinatura" });
    }
  },

  webhook: async (req, res) => {
    try {
      const { payment_subscription_id, event } = req.body;
      if (!payment_subscription_id || !event)
        return res.status(400).json({ error: "Payload inválido" });

      const assinatura = await Assinatura.findOne({
        where: { payment_subscription_id },
      });
      if (!assinatura)
        return res.status(404).json({ error: "Assinatura não encontrada" });

      if (event === "payment_success") {
        const now = new Date();
        const data_fim = new Date(now.setMonth(now.getMonth() + 3));

        assinatura.status = "ativo";
        assinatura.data_fim = data_fim;
        await assinatura.save();

        await Usuario.update(
          { plano: "premium", premium_expira_em: data_fim },
          { where: { id: assinatura.usuario_id } }
        );

        return res.json({
          ok: true,
          message: "Pagamento simulado com sucesso — assinatura ativa.",
        });
      }

      if (event === "payment_failed") {
        assinatura.status = "pendente";
        await assinatura.save();
        return res.json({
          ok: true,
          message: "Pagamento simulado com falha — assinatura pendente.",
        });
      }

      return res.status(400).json({ error: "Evento desconhecido." });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro no webhook." });
    }
  },

  statusAssinatura: async (req, res) => {
    try {
      const { userId } = req.params;
      const assinatura = await Assinatura.findOne({
        where: { usuario_id: userId },
        order: [["createdAt", "DESC"]],
      });

      if (!assinatura) return res.json({ ativo: false });

      const ativo =
        assinatura.status === "ativo" &&
        new Date(assinatura.data_fim) > new Date();

      return res.json({ ativo, assinatura });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao buscar status." });
    }
  },

  listar: async (req, res) => {
    try {
      const assinaturas = await Assinatura.findAll({ include: Usuario });
      res.json(assinaturas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  buscarPorUsuario: async (req, res) => {
    try {
      const { usuario_id } = req.params;
      const assinaturas = await Assinatura.findAll({
        where: { usuario_id },
        include: Usuario,
      });
      res.json(assinaturas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
cancelarAssinatura: async (req, res) => {
  try {
    const { id } = req.params;

    const assinatura = await Assinatura.findByPk(id);

    if (!assinatura) {
      return res.status(404).json({ error: "Assinatura não encontrada" });
    }

    await Consulta.destroy({
      where: { assinatura_id: id }
    });

    await Usuario.update(
      { plano: "free", premium_expira_em: null },
      { where: { id: assinatura.usuario_id } }
    );

    await assinatura.destroy();

    return res.json({
      ok: true,
      message: "Assinatura cancelada e todas as consultas removidas."
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao cancelar assinatura." });
  }
},


  atualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const assinatura = await Assinatura.findByPk(id);
      if (!assinatura)
        return res.status(404).json({ error: "Assinatura não encontrada" });
      await assinatura.update(req.body);
      res.json(assinatura);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deletar: async (req, res) => {
    try {
      const { id } = req.params;
      const assinatura = await Assinatura.findByPk(id);
      if (!assinatura)
        return res.status(404).json({ error: "Assinatura não encontrada" });
      await assinatura.destroy();
      res.json({ message: "Assinatura deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

export default assinaturaController;
