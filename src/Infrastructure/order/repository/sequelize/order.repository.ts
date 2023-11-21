import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import Order from "../../../../domain/checkout/entity/order";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository-interface";
import OrderItem from "../../../../domain/checkout/entity/order_items";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {     
    const sequelize = OrderModel.sequelize;
    
    return sequelize.transaction(async (t) => {      
      await OrderModel.update(
        {
          customer_id: entity.customerId,
          total: entity.total(),
        },
        {
          where: {
            id: entity.id,
          },
          transaction: t,
        }
      );

      await OrderItemModel.destroy({
        where: {
          order_id: entity.id,
        },
        transaction: t,
      });
    
      await OrderItemModel.bulkCreate(
        entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        })),
        {
          transaction: t,
        }
      );
    });

  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [
        {
          model: OrderItemModel 
        }
      ],
    });
    return new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(orderItem => new OrderItem(
        orderItem.id,
        orderItem.name,
        orderItem.price,
        orderItem.product_id,        
        orderItem.quantity,
      ))
    );
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [
        { model: OrderItemModel }
      ],
    });
    
    return orderModels.map(orderModel => new Order(
      orderModel.id,
      orderModel.customer_id,
      orderModel.items.map(orderItem => new OrderItem(
        orderItem.id,
        orderItem.name,
        orderItem.price,
        orderItem.product_id,
        orderItem.quantity,
      )),
    ));
  }
  
}
