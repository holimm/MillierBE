// External Dependencies
import express, { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { collections } from "../services/database.service";
import {
  ForgotPasswordAccountModel,
  GoogleProfileType,
  RegisterAccountModel,
  UsersAddressUpdateModel,
  UsersInformationUpdateModel,
  UsersModel,
  UsersPasswordUpdateModel,
} from "../models/users";
import bcrypt from "bcrypt";
import { isEmpty, result, toString } from "lodash";
import { generateUUIDToken } from "../helpers/commonHelpers";
import { sendEmailRegisterAccount } from "../helpers/sendEmail";
import dayjs from "dayjs";
// Global Config
export const usersRouter = express.Router();
usersRouter.use(express.json());
// GET
usersRouter.get("/", async (req: Request, res: Response) => {
  try {
    const result = (await collections
      .users!.find({ username: req.query.username })
      .toArray()) as unknown as UsersModel[];

    console.log(result);
    res.status(200).send(result);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
usersRouter.get("/sessionSignIn", async (req: Request, res: Response) => {
  try {
    let [scheme, token]: any = req.headers.authorization?.split(" ");
    switch (scheme) {
      case "Bearer":
        const resultUser = (await collections.users!.findOne({
          token: token,
        })) as unknown as UsersModel[];
        res.status(200).send({
          status: "success",
          data: resultUser,
        });
        break;
    }
    // res.status(200).send("Test");
  } catch (error: any) {
    console.log(error);
    res.status(500).send(error.message);
  }
});
// POST
usersRouter.post("/signin", async (req: Request, res: Response) => {
  try {
    const resultUser = (await collections.users!.findOne({
      username: req.body.username,
    })) as unknown as UsersModel;
    if (!isEmpty(resultUser)) {
      bcrypt.compare(req.body.password, resultUser.password).then((result) => {
        if (result) {
          res.status(200).send({
            status: "success",
            data: { ...resultUser, remember: req.body.remember },
          });
        } else {
          res.status(200).send({
            status: "error",
            data: "Wrong username or password",
          });
        }
      });
    } else {
      res.status(200).send({
        status: "error",
        data: "User not found",
      });
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});
usersRouter.post("/verifyUserAccount", async (req: Request, res: Response) => {
  try {
    let query = req.body as {
      emailVerifyToken: string;
    };
    const resultUser = (await collections.users!.findOne(
      query
    )) as unknown as UsersModel;
    if (!isEmpty(resultUser)) {
      if (dayjs().isBefore(dayjs(resultUser.verifyTokenExpireDate))) {
        const resultCreateAddress = await collections.users!.updateOne(query, {
          $set: {
            emailVerifyToken: "",
            verifyTokenExpireDate: "",
            statusVerify: true,
          },
        });
        resultCreateAddress
          ? res.status(200).send({
              status: "success",
              data: `Congratulations! Your email has been successfully verified. You're now a verified member of our community.`,
            })
          : res.status(200).send({
              status: "error",
              data: "Sorry, Your email verification has been rejected.",
            });
      } else {
        res.status(200).send({
          status: "error",
          data: "Your verification link has expired",
        });
      }
    } else {
      res.status(200).send({
        status: "error",
        data: "Your verification token not existed",
      });
    }
  } catch (error: any) {
    res.status(400).send({ status: "error", data: error.message });
  }
});
usersRouter.post("/createUserAccount", async (req: Request, res: Response) => {
  try {
    const generateToken = generateUUIDToken();
    let registerAccountData: RegisterAccountModel =
      req.body as RegisterAccountModel;
    const resultUser = (await collections.users!.findOne({
      $or: [
        {
          username: registerAccountData.username,
        },
        {
          email: registerAccountData.email,
        },
      ],
    })) as unknown as UsersModel;
    if (isEmpty(resultUser)) {
      registerAccountData.password = toString(
        await bcrypt.hash(toString(registerAccountData.password), 14)
      );
      const isSentEmail = await sendEmailRegisterAccount({
        to: registerAccountData.email,
        subject: "Millier Email Verification",
        text: `Hello, Thank you for signing up with our service!<br> 
        To complete your registration, please verify your email address by clicking the link below:<br>
        Verification Link: http://localhost:3034/verify-email?token=${generateToken}<br>
        The email verification link will expire in 1 hour<br>
        If you did not sign up for our service, you can safely ignore this email.<br>
        Best regards,<br>Millier`,
        html: `
        <p>Hello,</p>
        <p>Thank you for signing up with our service! To complete your registration, please verify your email address by clicking the link below:</p>
        <p><a href="http://localhost:3034/verify-email?token=${generateToken}">Verification Link</a></p>
        <p>The email verification link will expire in 1 hour.</p>
        <p>If you did not sign up for our service, you can safely ignore this email.</p>
        <p>Best regards,<br>Millier</p>`,
      });
      const resultCreateAddress = await collections.users!.insertOne({
        ...registerAccountData,
        address: [],
        token: toString(
          await bcrypt.hash(toString(registerAccountData.username), 10)
        ),
        statusVerify: false,
        verifyTokenExpireDate: dayjs().add(1, "hour").format(),
        emailVerifyToken: generateToken,
      });
      isSentEmail && resultCreateAddress
        ? res.status(200).send({
            status: "success",
            data: "Waiting to verify email",
          })
        : res.status(200).send({
            status: "error",
            data: "There was an error when sending email",
          });
    } else {
      if (!resultUser.statusVerify) {
        if (!dayjs().isBefore(dayjs(resultUser.verifyTokenExpireDate))) {
          const query = { email: registerAccountData.email };
          registerAccountData.password = toString(
            await bcrypt.hash(toString(registerAccountData.password), 14)
          );
          const isSentEmail = await sendEmailRegisterAccount({
            to: registerAccountData.email,
            subject: "Millier Email Verification",
            text: `Hello, Thank you for signing up with our service!<br> 
            To complete your registration, please verify your email address by clicking the link below:<br>
            Verification Link: http://localhost:3034/verify-email?token=${generateToken}<br>
            The email verification link will expire in 1 hour<br>
            If you did not sign up for our service, you can safely ignore this email.<br>
            Best regards,<br>Millier`,
            html: `
            <p>Hello,</p>
            <p>Thank you for signing up with our service! To complete your registration, please verify your email address by clicking the link below:</p>
            <p><a href="http://localhost:3034/verify-email?token=${generateToken}">Verification Link</a></p>
            <p>The email verification link will expire in 1 hour.</p>
            <p>If you did not sign up for our service, you can safely ignore this email.</p>
            <p>Best regards,<br>Millier</p>`,
          });
          const resultCreateAddress = await collections.users!.updateOne(
            query,
            {
              ...registerAccountData,
              address: [],
              token: toString(
                await bcrypt.hash(toString(registerAccountData.username), 10)
              ),
              statusVerify: false,
              verifyTokenExpireDate: dayjs().add(1, "hour").format(),
              emailVerifyToken: generateToken,
            }
          );
          isSentEmail && resultCreateAddress
            ? res.status(200).send({
                status: "success",
                data: "Waiting to verify email",
              })
            : res.status(200).send({
                status: "error",
                data: "There was an error when sending email",
              });
        } else {
          res.status(200).send({
            status: "error",
            data: "The verification link tied with this email hasn't expired yet",
          });
        }
      } else {
        res.status(200).send({
          status: "error",
          data: "Your username or email already existed",
        });
      }
    }
  } catch (error: any) {
    res.status(400).send({ status: "error", data: error.message });
  }
});
usersRouter.post(
  "/sendEmailResetPassword",
  async (req: Request, res: Response) => {
    try {
      let accountData: ForgotPasswordAccountModel =
        req.body as ForgotPasswordAccountModel;
      const resultUser = (await collections.users!.findOne({
        email: accountData.email,
      })) as unknown as UsersModel;
      if (!isEmpty(resultUser)) {
        if (resultUser.statusVerify) {
          if (!dayjs().isBefore(dayjs(resultUser.verifyTokenExpireDate))) {
            const generateToken = generateUUIDToken();
            const query = { email: accountData.email };
            const isSentEmail = await sendEmailRegisterAccount({
              to: accountData.email,
              subject: "Reset Your Millier Account Password",
              text: `We noticed that you've requested to reset your account password.<br> 
        Your reset password link: http://localhost:3034/reset-password?token=${generateToken}<br>
        If you didn't request this password reset, please disregard this email. Your account remains secure, and no changes have been made.<br>
        For security reasons, the password reset link will expire in 1 hour. If you don't reset your password within this timeframe, you'll need to request another password reset.<br>
        Thank you,<br>Millier`,
              html: `
        <p>We noticed that you've requested to reset your account password.</p>
        <p><a href="http://localhost:3034/reset-password?token=${generateToken}">Reset Password Link</a></p>
        <p>If you didn't request this password reset, please disregard this email. Your account remains secure, and no changes have been made.</p>
        <p>For security reasons, the password reset link will expire in 1 hour. If you don't reset your password within this timeframe, you'll need to request another password reset.</p>
        <p>Thank you,<br>Millier</p>`,
            });
            const resultResetPasswordToken = await collections.users!.updateOne(
              query,
              {
                $set: {
                  verifyTokenExpireDate: dayjs().add(1, "hour").format(),
                  emailVerifyToken: generateToken,
                },
              }
            );
            isSentEmail && resultResetPasswordToken
              ? res.status(200).send({
                  status: "success",
                  data: "Waiting to verify email",
                })
              : res.status(200).send({
                  status: "error",
                  data: "There was an error when sending email",
                });
          } else {
            res.status(200).send({
              status: "error",
              data: "The verification link tied with this email hasn't expired yet",
            });
          }
        } else {
          res.status(200).send({
            status: "error",
            data: "The account link with this email hasn't verified",
          });
        }
      } else {
        res.status(200).send({
          status: "error",
          data: "Email not existed in database",
        });
      }
    } catch (error: any) {
      res.status(400).send({ status: "error", data: error.message });
    }
  }
);
usersRouter.post(
  "/verifyResetPassword",
  async (req: Request, res: Response) => {
    try {
      let query = {
        emailVerifyToken: req.body.emailVerifyToken,
      };
      const resultUser = (await collections.users!.findOne(
        query
      )) as unknown as UsersModel;
      if (!isEmpty(resultUser)) {
        if (dayjs().isBefore(dayjs(resultUser.verifyTokenExpireDate))) {
          const resultCreateAddress = await collections.users!.updateOne(
            query,
            {
              $set: {
                password: toString(
                  await bcrypt.hash(toString(req.body.password), 14)
                ),
                emailVerifyToken: "",
                verifyTokenExpireDate: "",
              },
            }
          );
          resultCreateAddress
            ? res.status(200).send({
                status: "success",
                data: `Your password has changed`,
              })
            : res.status(200).send({
                status: "error",
                data: "Sorry, Your reset email ticket has been rejected.",
              });
        } else {
          res.status(200).send({
            status: "error",
            data: "Your reset password link has expired",
          });
        }
      } else {
        res.status(200).send({
          status: "error",
          data: "Your verification token not existed",
        });
      }
    } catch (error: any) {
      res.status(400).send({ status: "error", data: error.message });
    }
  }
);
usersRouter.post("/createAddress/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const addressCreateData: UsersAddressUpdateModel =
      req.body as UsersAddressUpdateModel;
    const query = { _id: new ObjectId(id) };
    const resultCreateAddress = await collections.users!.updateOne(query, {
      $push: {
        address: addressCreateData,
      },
    });
    resultCreateAddress
      ? res.status(200).send({
          status: "success",
          data: "Successfully created new address information",
        })
      : res.status(200).send({
          status: "error",
          data: "Address information not created",
        });
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
usersRouter.post("/googleLogin", async (req: Request, res: Response) => {
  try {
    const googleProfileData: GoogleProfileType = req.body as GoogleProfileType;
    const query = { email: googleProfileData.email };
    const resultUser = (await collections.users!.findOne(
      query
    )) as unknown as UsersModel;
    console.group(resultUser);
    if (!isEmpty(resultUser)) {
      resultUser
        ? res.status(200).send({
            status: "success",
            data: resultUser,
          })
        : res.status(200).send({
            status: "error",
            data: "Error getting account information",
          });
    } else {
      const dataUser = {
        name: googleProfileData.name,
        username: "",
        email: googleProfileData.email,
        phone: "",
        password: "",
        address: [],
        token: toString(
          await bcrypt.hash(toString(googleProfileData.email), 10)
        ),
        statusVerify: true,
        verifyTokenExpireDate: "",
        emailVerifyToken: "",
      };
      const resultCreateAddress = await collections.users!.insertOne(dataUser);
      resultCreateAddress
        ? res.status(200).send({
            status: "success",
            data: dataUser,
          })
        : res.status(200).send({
            status: "error",
            data: "Error while trying to sign in using Google",
          });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
// PUT
usersRouter.put("/updatePassword/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const passwordUpdate: UsersPasswordUpdateModel =
      req.body as UsersPasswordUpdateModel;
    const query = { _id: new ObjectId(id) };

    const resultUser = (await collections.users!.findOne(
      query
    )) as unknown as UsersModel;

    if (!isEmpty(resultUser)) {
      bcrypt
        .compare(passwordUpdate.old_password, resultUser.password)
        .then(async (result) => {
          if (result) {
            const resultUpdatePassword = await collections.users!.updateOne(
              query,
              {
                $set: {
                  password: await bcrypt.hash(passwordUpdate.password, 14),
                },
              }
            );
            resultUpdatePassword
              ? res.status(200).send({
                  status: "success",
                  data: "Successfully updated password",
                })
              : res.status(304).send({
                  status: "error",
                  data: "Password not updated",
                });
          } else {
            res.status(200).send({
              status: "error",
              data: "Incorrect old password",
            });
          }
        });
    } else {
      res.status(200).send({
        status: "error",
        data: "User not found",
      });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
usersRouter.put(
  "/updateInformation/:id",
  async (req: Request, res: Response) => {
    const id = req?.params?.id;
    try {
      let {
        password_confirm,
        ...informationUpdate
      }: UsersInformationUpdateModel = req.body as UsersInformationUpdateModel;
      const query = { _id: new ObjectId(id) };
      if (isEmpty(informationUpdate.username)) {
        const resultUpdateInformation = await collections.users!.updateOne(
          query,
          {
            $set: informationUpdate,
          }
        );
        resultUpdateInformation
          ? res.status(200).send({
              status: "success",
              data: "Successfully updated personal information",
            })
          : res.status(200).send({
              status: "error",
              data: "Personal information not updated",
            });
      } else {
        const resultUser = (await collections.users!.findOne({
          $or: [{ username: informationUpdate.username }],
        })) as unknown as UsersModel;
        if (isEmpty(resultUser)) {
          informationUpdate.password = toString(
            await bcrypt.hash(toString(informationUpdate.password), 14)
          );
          const resultUpdateInformation = await collections.users!.updateOne(
            query,
            {
              $set: informationUpdate,
            }
          );
          resultUpdateInformation
            ? res.status(200).send({
                status: "success",
                data: "Successfully updated personal information",
              })
            : res.status(200).send({
                status: "error",
                data: "Personal information not updated",
              });
        } else {
          res.status(200).send({
            status: "error",
            data: "Username already existed",
          });
        }
      }
    } catch (error: any) {
      console.error(error.message);
      res.status(400).send(error.message);
    }
  }
);
usersRouter.put("/updateAddress/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const { index, ...informationUpdate }: UsersAddressUpdateModel =
      req.body as UsersAddressUpdateModel;

    const query = { _id: new ObjectId(id) };
    const resultUpdateAddress = await collections.users!.updateOne(query, {
      $set: {
        [`address.${index}`]: informationUpdate,
      },
    });
    resultUpdateAddress
      ? res.status(200).send({
          status: "success",
          data: "Successfully updated address information",
        })
      : res.status(304).send({
          status: "error",
          data: "Address information not updated",
        });
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
usersRouter.put("/deleteAddress/:id", async (req: Request, res: Response) => {
  const id = req?.params?.id;
  try {
    const { index, ...informationUpdate }: UsersAddressUpdateModel =
      req.body as UsersAddressUpdateModel;

    const query = { _id: new ObjectId(id) };
    const resultSetNullAddress = await collections.users!.updateOne(query, {
      $unset: {
        [`address.${index}`]: 1,
      },
    });
    const resultUpdateAddress = await collections.users!.updateOne(query, {
      $pull: {
        address: null,
      },
    });
    resultUpdateAddress
      ? res.status(200).send({
          status: "success",
          data: "Successfully deleted address information",
        })
      : res.status(304).send({
          status: "error",
          data: "Address information not deleted",
        });
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send(error.message);
  }
});
// DELETE
