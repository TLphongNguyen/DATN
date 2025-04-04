import ShopServicer from "../../services/ShopServicer";
import { Request, Response } from "express";
import { ICreateShopForm } from "../../services/interfaces/IShopTypeServicer";

const createShop = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ICreateShopForm = req.body;
    const shop = await ShopServicer.createShop(data);
    res.status(200).json({
      message: "Shop created successfully",
      shop,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getShop = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const shop = await ShopServicer.getShop(Number(customerId));
    res.status(200).json({
      message: "Shop fetched successfully",
      shop,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createShop, getShop };
