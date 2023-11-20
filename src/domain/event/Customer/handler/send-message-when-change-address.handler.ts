import EventHandlerInterface from "../../@shared/event-handler.interface";
import ChangeCustomerAddressEvent from "../customer-change-address.event";

export default class SendMessageWhenChangeCustomerAddressHandler implements
    EventHandlerInterface<ChangeCustomerAddressEvent> {
    handle(event: ChangeCustomerAddressEvent): void {
        let { id, name, address } = event.customerAddress

        console.log(`Endereço do cliente: ${id}, ${name} alterado para: ${address.toString()}`);
    }
}