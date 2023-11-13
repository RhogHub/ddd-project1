import Address from "./address";
import Customer from "./customer";

describe("Customer unit test", () => {
    it("should throw error when id is empty", () => {
        expect(() => {
            let customer = new Customer("", "John");
        }).toThrow("Id is required");        
    });

    it("should throw error when name is empty", () => {
        expect(() => {
            let customer = new Customer("123", "");
        }).toThrow("Name is required");        
    });

    it("should change name", () => {
        // Arrange
        const customer = new Customer("123", "John");

        //Act
        customer.changeName("Jane");

        //Assert
        expect(customer.name).toBe("Jane");        
    });

    it("should activate customer", () => {        
        const customer = new Customer("1", "Customer 1");
        const address = new Address("Street 1", 123, "13930-000", "São Paulo");   
        customer.Address = address;

        expect(customer.isActive()).toBe(true);

    });

    it("should deactivate customer", () => {       
        const customer = new Customer("1", "Customer 1");        
        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });

    it("should throw error when address in undefined when you activate a customer", () => {        
        expect(() => {
            const customer = new Customer("1", "Customer 1");       
            customer.activate();
        }).toThrow("Address is mandatory to activate a customer");      
    });

    it("should add reward points", () => {
        const customer = new Customer("1", "Customer 1")
        expect(customer.rewardPoints).toBe(0); // para verificar se inicia com 0 os pontos

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })

});