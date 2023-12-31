import Address from "../value-object/address"
import EventInterface from "../../@shared/event/event.interface"

type dataChangeCustomerAddress = {
    id: string,
    name: string,
    address: Address,
    //active: boolean,
}

export default class ChangeCustomerAddressEvent implements EventInterface {
    dataTimeOccurred: Date;
    eventData: any;

    constructor(eventData: dataChangeCustomerAddress) {
        this.dataTimeOccurred = new Date();
        this.eventData = eventData;
    }

    get customerAddress() {
        return this.eventData;
    }

}