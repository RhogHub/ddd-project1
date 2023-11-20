import Address from "../../entity/address";
import Customer from "../../entity/customer";
import EventDispatcher from "../@shared/event-dispatcher";
import ChangeCustomerAddressEvent from "./customer-change-address.event";
import SendMessageWhenChangeCustomerAddressHandler from "./handler/send-message-when-change-address.handler";

describe("Domain events tests change customer address", () => {
    it("should notify when event handler change customer address", () => {
        const eventDispatcher = new EventDispatcher();
        const sendConsoleLogHandlerEventHandler = new SendMessageWhenChangeCustomerAddressHandler();
        const spysendConsoleLogHandlerEventHandle = jest.spyOn(sendConsoleLogHandlerEventHandler, 'handle');

        eventDispatcher.register("ChangeCustomerAddressEvent", sendConsoleLogHandlerEventHandler);

        expect(eventDispatcher.getEventHandlers["ChangeCustomerAddressEvent"][0]).toMatchObject(sendConsoleLogHandlerEventHandler);

        const customer = new Customer("3", "Rodrigo Godoi");
        const customerAddress = new Address("Rua CJB", 333, "13930-000", "Serra Negra");

        const changeCustomerAddressEvent = new ChangeCustomerAddressEvent({
            id: customer.id,
            name: customer.name,
            address: customerAddress,
        });

        eventDispatcher.notify(changeCustomerAddressEvent);
        expect(spysendConsoleLogHandlerEventHandle).toHaveBeenCalled();
    });




});