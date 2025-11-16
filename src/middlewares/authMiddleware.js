import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;


  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido." });

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token)
    return res.status(401).json({ error: "Formato de token inválido." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    console.error("Erro no token:", error.message);
    return res
      .status(401)
      .json({ error: "Token inválido ou expirado. Faça login novamente." });
  }
};

export default authMiddleware;
