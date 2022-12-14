import Historic from "../models/Historic";
import Price from "../models/Price";
import User from "../models/User";
import UserInfos from "../models/UserInfos";
import preco from "../shared/settings.json"

class UserInfosComponents {
    public async updateUserInfos(cpf: string, referenceMonth: number) {
        var userInfos = await this.verifyIfUserExist(cpf, referenceMonth);

        const obj = await this.updateInfos(cpf, referenceMonth);

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
        const user = await User.findOne({cpf: cpf});
        var accountObj = {
            cpf: cpf,
            fullname: user?.fullName,
            referenceMonth: referenceMonth,
        };

        var userInfos = await UserInfos.create(accountObj);

        return userInfos;
    }

    private async updateInfos(cpf: string, referenceMonth: number) {
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
        var premio = 0;

        const price = await Price.findOne({ monthDate: referenceMonth });
        if(!price) return infoObj;

        for (let index = 0; index < historics.length; index++) {
            km = km + historics[index].km;
            litros = litros + historics[index].liters;
            premio = premio + ((historics[index].km / historics[index].standardAverage) - historics[index].liters) * 0.6 * price.price;
        }

        var media = km / litros;
        var lastMedia = (historics[historics.length - 1].km) / historics[historics.length - 1].liters;

        infoObj.kmTraveled = km;
        infoObj.average = media;
        infoObj.lastAverage = lastMedia;
        infoObj.award = premio;

        return infoObj;
    }
}

export default new UserInfosComponents();
