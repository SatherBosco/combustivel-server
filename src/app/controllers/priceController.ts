import { Request, Response } from "express";
import Price from "../models/Price";

class PriceController {
    public async getPrice(req: Request, res: Response) {
        try {
            var priceByDb = await Price.findOne({ referenceMonth: req.params.month });

            const price = {
                price: priceByDb?.price,
                monthDate: priceByDb?.referenceMonth,
                referenceMonth: priceByDb?.referenceMonth,
            };

            return res.send({ message: "Preço retornado com sucesso.", price });
        } catch {
            return res.status(400).send({ message: "Erro: Falha na solicitação do preço de referência do mês." });
        }
    }

    public async setPrice(req: Request, res: Response) {
        const { price, monthDate } = req.body;
        try {
            if (!req.role || req.role > 3) {
                return res.status(401).send({ message: "Não autorizado." });
            }

            if (await Price.findOne({ monthDate: monthDate })) return res.status(400).send({ message: "Preço já cadastrado para este mês." });

            var priceObj = { price: price, monthDate: monthDate };
            await Price.create(priceObj);

            return res.send({ message: "Preço cadastrado com sucesso." });
        } catch {
            return res.status(400).send({ message: "Falha no registro do preço." });
        }
    }

    public async updatePrice(req: Request, res: Response) {}
}

export default new PriceController();
