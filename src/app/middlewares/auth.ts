import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import authConfig from "../../configs/auth.json";

interface DecodedPayload {
    id: string;
    role: number;
    iat: number;
    exp: number;
}

export default function authVerify(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).send({ message: "Erro: Sem token." });

    const parts = authHeader.split(" ");

    if (parts.length !== 2) return res.status(401).send({ message: "Erro: Erro no Token." });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ message: "Erro: Token malformado." });

    try {
        const decoded = verify(token, authConfig.secret);

        const { id, role } = decoded as DecodedPayload;

        req.userId = id;
        req.role = role;

        return next();
    } catch {
        return res.status(401).send({ message: "Erro: Token inválido." });
    }

}
