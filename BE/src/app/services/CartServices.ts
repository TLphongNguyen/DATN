import { ICartServices } from "./interfaces/ICartServices";
import Prismaclient from "../../../prisma";

const CartService = {
  getCart: async (customerId: number): Promise<any> => {
    try {
      const cart = await Prismaclient.cart.findMany({
        where: {
          customerId: customerId,
        },
        include: {
          ProductVariant: {
            include: {
              VariantValue: true,
            },
          },
        },
      });

      if (cart.length === 0) {
        throw new Error("Cart is empty for the given customer.");
      }

      const productIds = cart.map((item) => item.ProductVariant.productId);
      const products = await Prismaclient.products.findMany({
        where: {
          productId: { in: productIds },
        },
      });
      const formattedCart = cart.map((item) => {
        const product = products.find(
          (prod) => prod.productId === item.ProductVariant.productId
        );
        return {
          ...item,
          ...item.ProductVariant.VariantValue,
          productId: item.ProductVariant.productId,
          productName: product?.productName,
          price: product?.price,
          image: product?.img,
        };
      });
      return formattedCart;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw new Error("Failed to fetch cart");
    }
  },

  addtocart: async (data: ICartServices): Promise<ICartServices> => {
    try {
      const existingCart = await Prismaclient.cart.findFirst({
        where: {
          customerId: data.customerId,
          id: data.id,
        },
      });

      if (existingCart) {
        const updatedCart = await Prismaclient.cart.update({
          where: { cartId: existingCart.cartId },
          data: { quantity: existingCart.quantity + data.quantity },
        });
        return updatedCart;
      }
      const response = await Prismaclient.cart.create({
        data: {
          customerId: data.customerId,
          id: data.id,
          quantity: data.quantity,
        },
      });
      return response;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw new Error("Failed to add to cart");
    }
  },
  deleteCart: async (cartId: number): Promise<void> => {
    try {
      await Prismaclient.cart.delete({
        where: { cartId: cartId },
      });
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw new Error("Failed to delete cart");
    }
  },
};
export default CartService;
