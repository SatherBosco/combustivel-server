import Historic from "../models/Historic";
import Truck from "../models/Truck";
import UserInfos from "../models/UserInfos";

class UserInfosComponents {
    public async verifyIfUserExist(cpf: string, truckLicensePlate: string, referenceMonth: number) {
        var userInfos = await UserInfos.findOne({ cpf: cpf, referenceMonth: referenceMonth });

        if (!userInfos) userInfos = await this.createUserInfos(cpf, truckLicensePlate);

        const obj = await this.updateUserInfos(cpf, referenceMonth, truckLicensePlate);

        userInfos.kmTraveled = obj.kmTraveled;
        userInfos.average = obj.average;
        userInfos.lastAverage = obj.lastAverage;
        userInfos.award = obj.award;

        await userInfos.save();

        return userInfos;
    }

    public async createUserInfos(cpf: String, truckLicensePlate: String) {
        var thisMonth = new Date().getMonth() + 1;

        var accountObj = {
            cpf: cpf,
            truckLicensePlate: truckLicensePlate,
            referenceMonth: thisMonth,
        };

        var userInfos = await UserInfos.create(accountObj);

        return userInfos;
    }

    public async updateUserInfos(cpf: string, referenceMonth: number, truckLicensePlate: string) {
        var historics = await Historic.find({ user: cpf, referenceMonth: referenceMonth }).sort({ odometer: 1 });
        var lastHistoric = await Historic.find({ user: cpf, referenceMonth: referenceMonth - 1 })
            .sort({ odometer: -1 })
            .limit(1);

        var truck = await Truck.findOne({ licensePlate: truckLicensePlate });

        var infoObj = {
            kmTraveled: 0,
            average: 0,
            lastAverage: 0,
            award: 0,
        };

        if (!historics || historics.length === 0 || (!lastHistoric && historics.length <= 1) || (lastHistoric.length === 0 && historics.length <= 1) || !truck) return infoObj;
        truck.odometer = historics[historics.length - 1].odometer;
        await truck.save();
        
        var km = lastHistoric.length === 0 ? 0 : historics[0].odometer - lastHistoric[0].odometer;
        var litros = historics[0].liters;
        var preco = historics[0].value;

        for (let index = 1; index < historics.length; index++) {
            var km = km + historics[index].odometer - historics[index - 1].odometer;
            var litros = litros + historics[index].liters;
            var preco = preco + historics[index].value;
        }
        var media = km / litros;
        var premio = (km / truck.average - litros) * 0.6 * (preco / litros);
        var lastMedia = (historics[historics.length - 1].odometer - historics[historics.length - 2].odometer) / historics[historics.length - 1].liters;

        infoObj.kmTraveled = km;
        infoObj.average = media;
        infoObj.lastAverage = lastMedia;
        infoObj.award = premio;

        return infoObj;
    }
}

export default new UserInfosComponents();
