import Address from "./domain/entity/address";
import Customer from "./domain/entity/customer";
import Order from "./domain/entity/order";
import OrderItem from "./domain/entity/order_items";

//customer aggregate (relacionado via customerId)
let customer = new Customer("123","Rodrigo Godoi");
const address = new Address("Rua xxx", 33, "13930-000", "Serra Negra");
customer.Address = address;
customer.activate();

// order aggregate (relacionado por objeto - entidade)
const item1 = new OrderItem("1", "Item 1", 10, "p1", 1);
const item2 = new OrderItem("2", "Item 2", 20, "p2", 2);
const order = new Order("1", "123", [item1, item2]);