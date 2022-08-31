import Historic from "../models/Historic";
import Truck from "../models/Truck";
import UserInfos from "../models/UserInfos";

class UserInfosComponents {
    public async updateUserInfos(cpf: string, truckAverage: number, referenceMonth: number) {
        var userInfos = await this.verifyIfUserExist(cpf, referenceMonth);

        const obj = await this.updateInfos(cpf, truckAverage, referenceMonth);

        userInfos.kmTraveled = obj.kmTraveled;
        userInfos.average = obj.average;
        userInfos.lastAverage = obj.lastAverage;
        userInfos.award = obj.award;

        await userInfos.save();

        return userInfos;
    }
    
    private async verifyIfUserExist(cpf: string, referenceMonth: number) {
        var userInfos = await UserInfos.findOne({ cpf: cpf, referenceMonth: referenceMonth });

        if (!userInfos) userInfos = await this.createUserInfos(cpf, referenceMonth);

        return userInfos;
    }

    private async createUserInfos(cpf: string, referenceMonth: number) {
        var accountObj = {
            cpf: cpf,
            referenceMonth: referenceMonth,
        };

        var userInfos = await UserInfos.create(accountObj);

        return userInfos;
    }

    private async updateInfos(cpf: string, truckAverage: number, referenceMonth: number) {
        var historics = await Historic.find({ cpf: cpf, referenceMonth: referenceMonth }).sort({ date: 1 });

        var infoObj = {
            kmTraveled: 0,
            average: 0,
            lastAverage: 0,
            award: 0,
        };

        if (!historics || historics.length === 0) return infoObj;
        
        var km = 0;
        var litros = 0;
        var preco = 0;

        for (let index = 0; index < historics.length; index++) {
            var km = km + historics[index].km;
            var litros = litros + historics[index].liters;
            var preco = preco + historics[index].value;
        }
        var media = km / litros;
        var lastMedia = (historics[historics.length - 1].km) / historics[historics.length - 1].liters;
        var premio = ((km / truckAverage) - litros) * 0.6 * (preco / litros);

        infoObj.kmTraveled = km;
        infoObj.average = media;
        infoObj.lastAverage = lastMedia;
        infoObj.award = premio;

        return infoObj;
    }
}

export default new UserInfosComponents();
