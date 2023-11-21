import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_items";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepository from "./order.repository";
import productRepository from "../../../product/repository/sequelize/product.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should update an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("3", "Rodrigo Godoi");
    const address = new Address("Rua CJB", 1, "13930-000", "Serra Negra");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Mouse", 55.00);
    await productRepository.create(product1);

    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      1
    );

    const order = new Order("1", "3", [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    let lastCreatedOrder = await orderRepository.find(order.id);

    const product2 = new Product("2", "Monitor", 3333.00);
    await productRepository.create(product2);

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      1
    );

    lastCreatedOrder.items.push(orderItem2);
    await orderRepository.update(lastCreatedOrder);

    const orderModel = await OrderModel.findOne({
      where: { id: lastCreatedOrder.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "3",
      total: lastCreatedOrder.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: order.id,
          product_id: product1.id,
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: order.id,
          product_id: product2.id,
        }
      ],
    });

  });

  it("should find an order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("3", "Rodrigo Godoi");
    const address = new Address("Rua CJB", 1, "13930-000", "Serra Negra");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Mouse", 55.00);
    await productRepository.create(product1);

    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      1
    );

    const order = new Order("1", "3", [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    let returnedOrder = await orderRepository.find(order.id);

    expect(orderModel.toJSON()).toStrictEqual({
      id: returnedOrder.id,
      customer_id: returnedOrder.customerId,
      total: returnedOrder.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          product_id: orderItem1.productId,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: "1",
        }
      ],
    });

  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("3", "Rodrigo Godoi");
    const address = new Address("Rua CJB", 1, "13930-000", "Serra Negra");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Mouse", 55.00);
    await productRepository.create(product1);

    const product2 = new Product("2", "Monitor", 3333.00);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      1
    );

    const order1 = new Order("1", "3", [orderItem1]);

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      2
    );

    const order2 = new Order("2", "3", [orderItem2]);

    const orderRepository = new OrderRepository();

    await orderRepository.create(order1);
    await orderRepository.create(order2);

    // const orderModel = await OrderModel.findAll({     
    //   include: ["items"],
    // });

    let returnedOrders = await orderRepository.findAll();

    //expect(returnedOrders.length).toBe(orderModel.length); 

    expect(returnedOrders.map((order) => ({
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        order_id: order.id,
        product_id: item.productId,
      })),
    }))).toStrictEqual([
      {
        id: order1.id,
        customer_id: order1.customerId,
        total: order1.total(),
        items: [
          {
            id: orderItem1.id,
            name: orderItem1.name,
            price: orderItem1.price,
            quantity: orderItem1.quantity,
            order_id: order1.id,
            product_id: product1.id,
          },
        ],
      },
      {
        id: order2.id,
        customer_id: order2.customerId,
        total: order2.total(),
        items: [
          {
            id: orderItem2.id,
            name: orderItem2.name,
            price: orderItem2.price,
            quantity: orderItem2.quantity,
            order_id: order2.id,
            product_id: product2.id,
          },
        ],
      },
    ]);
  });

});
