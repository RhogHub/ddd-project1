import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import SendFirstMessageWhenCustomerIsCreatedHandler from "./handler/send-first-message-when-customer-is-created.handler";
import SendSecondMessageWhenCustomerIsCreatedHandler from "./handler/send-second-message-when-customer-is-created.handler";


describe("Domain events tests created customer", () => {
    it("should register an event handler of a customer", () => {
        const eventDispatcher = new EventDispatcher();
        const sendConsoleLog1EventHandler = new SendFirstMessageWhenCustomerIsCreatedHandler();
        const sendConsoleLog2EventHandler = new SendSecondMessageWhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog1EventHandler);
        eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog2EventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(sendConsoleLog1EventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(sendConsoleLog2EventHandler);
    });

    it("should unregister an event handler of a customer", () => {
        const eventDispatcher = new EventDispatcher();
        const sendConsoleLog1EventHandler = new SendFirstMessageWhenCustomerIsCreatedHandler();
        const sendConsoleLog2EventHandler = new SendSecondMessageWhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog1EventHandler);
        eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog2EventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(sendConsoleLog1EventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(sendConsoleLog2EventHandler);

        eventDispatcher.unregister("CustomerCreatedEvent", sendConsoleLog1EventHandler);
        eventDispatcher.unregister("CustomerCreatedEvent", sendConsoleLog2EventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(0);
    });

    it("should unregister all events handler of customer", () => {
        const eventDispatcher = new EventDispatcher();
        const sendConsoleLog1EventHandler = new SendFirstMessageWhenCustomerIsCreatedHandler();
        const sendConsoleLog2EventHandler = new SendSecondMessageWhenCustomerIsCreatedHandler();

        eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog1EventHandler);
        eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog2EventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(sendConsoleLog1EventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(sendConsoleLog2EventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeUndefined();
    });

    it("should notify all event handlers of a customer", () => {
        const eventDispatcher = new EventDispatcher();
        const sendConsoleLog1EventHandler = new SendFirstMessageWhenCustomerIsCreatedHandler();
        const sendConsoleLog2EventHandler = new SendSecondMessageWhenCustomerIsCreatedHandler();
        const spySendConsoleLog1EventHandler = jest.spyOn(sendConsoleLog1EventHandler, "handle");
        const spySendConsoleLog2EventHandler = jest.spyOn(sendConsoleLog2EventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog1EventHandler);
        eventDispatcher.register("CustomerCreatedEvent", sendConsoleLog2EventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(sendConsoleLog1EventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(sendConsoleLog2EventHandler);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "3",
            name: "Rodrigo Godoi",
            address: "Rua CJB, 999, Serra Negra, 13930-000",
            active: true,
        });

        eventDispatcher.notify(customerCreatedEvent);
        expect(spySendConsoleLog1EventHandler).toHaveBeenCalled();
        expect(spySendConsoleLog2EventHandler).toHaveBeenCalled();
    });

});