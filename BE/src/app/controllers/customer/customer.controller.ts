import { Request, Response } from "express";
import { customerServices } from "../../services/CustomerServices";

const updateCustomerController = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const data = req.body;
  try {
    const response = await customerServices.updateCustomer(
      parseInt(customerId),
      data
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateNumberPhoneController = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const data = req.body;
  try {
    const response = await customerServices.updateNumberPhone(
      parseInt(customerId),
      data
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
const updateEmailController = async (req: Request, res: Response) => {
  const { customerId } = req.params;
  const data = req.body;
  try {
    const response = await customerServices.updateEmail(
      parseInt(customerId),
      data
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export {
  updateCustomerController,
  updateNumberPhoneController,
  updateEmailController,
};
