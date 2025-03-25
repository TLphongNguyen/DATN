import { ICustomerType } from "./interfaces/ICustomerType";
import Prismaclient from "../../../prisma";

const customerServices = {
  updateCustomer: async (customerId: number, data: ICustomerType) => {
    try {
      const customer = await Prismaclient.customer.update({
        where: {
          customerId,
        },
        data: {
          avatar: data.avatar,
          customerName: data.fullName,
          nickName: data.nickname,
          birthday: new Date(data.birthday),
          gender: data.gender,
        },
      });
      return customer;
    } catch (error) {
      console.log(error);
    }
  },
  updateNumberPhone: async (customerId: number, data: any) => {
    const customer = await Prismaclient.customer.update({
      where: { customerId },
      data: { numberPhone: data.numberPhone },
    });
    return customer;
  },
  updateEmail: async (customerId: number, data: any) => {
    const customer = await Prismaclient.customer.update({
      where: { customerId },
      data: { email: data.email },
    });
    return customer;
  },
  updateAddress: async (customerId: number, data: any) => {
    const customer = await Prismaclient.customer.update({
      where: { customerId },
      data: { address: data.address },
    });
    return customer;
  },
};

export { customerServices };
