import { Request, Response } from "express";
import * as AuthService from "../../services/AuthenServices";

const signUp = async (req: Request, res: Response) => {
  const data = req.body;
  try {
    const result = await AuthService.SignUp(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

const loginGoogleController = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginGoogle();
    res.json(result);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
const callbackGoogleController = async (req: Request, res: Response) => {
  try {
    const { code } = req.params;

    if (!code) {
      res.status(400).json({ error: "Không có code từ Google." });
    }

    const result = await AuthService.handleGoogleCallback(code);

    res.json({
      data: result.user,
    });
  } catch (error) {
    console.error("Lỗi callback Google:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// const SignIn = async (req: Request, res: Response) => {
//     const data = req.body;
//     try {
//         const result = await AuthService.signIn(data);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(400).json(error);
//     }
// }
export { signUp, loginGoogleController, callbackGoogleController };
