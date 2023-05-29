import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import bycript from 'bcrypt'
import  config from "../config/config";
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';


const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const CLIENT_ID ="496085874157-k4pku4tjqv7hdm6hgquevgvo528ko5en.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN ="1//04mIsuR_VIwivCgYIARAAGAQSNwF-L9Ir7C3h_PPb3Epq0qoh8NdwiMveSeGOt0v3ePAhGMqTUc_NiP1Wqx94VYXlJFw1XTcNTBg";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI,
  REFRESH_TOKEN
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const ForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {email} = req.body;
        const CheckUser = await AppDataSource.getRepository(User).find({
            where: {
                email: email,
                status_user:'Active'
            },
          });
          if(Object.values(CheckUser).length === 0){
            return res.status(200).json({status:1,message: "Email does not exist"});
          }
            const Token = jwt.sign({ email: email }, config.token, {
                expiresIn: "5m",
            });
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "beebacorporation@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
            });
            const mailOptions = {
            from: "SmartSocket <beebacorporation@gmail.com>",
            to: email,
            subject: "มีการขอรีเซ็ตรหัสผ่านด้วยอีเมลของคุณ",  
            html: `
                <html>
        <head>
            <title>Reset Password</title>
            <meta charset="UTF-8">
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
        <title>Reset Password Email Template</title>
        <meta name="description" content="Reset Password Email Template.">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap" rel="stylesheet">
        <style type="text/css">
            a:hover {text-decoration: underline !important;}
            *{
    font-family: "Kanit", sans-serif;
            }
        </style>
        </head>
    <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
        <!--100% body table-->
        <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
            style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: "Open Sans", sans-serif;">
            <tr>
                <td>
                    <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                        align="center" cellpadding="0" cellspacing="0">
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="text-align:center;">
                            <a href="" title="logo" target="_blank">
                                <img width="160" src="https://cdn.discordapp.com/attachments/764897423666446366/967500127558316092/unknown.png" title="logo" alt="logo">
                            </a>
                            </td>
                        </tr>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td>
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                    style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="padding:0 35px;">
                                            <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:"Rubik",sans-serif;">
                                                รีเซ็ตรหัสผ่าน
                                                </h1>
                                            <span
                                                style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                            <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                มีการขอรีเซ็ตรหัสผ่านด้วยอีเมลของคุณ กดปุ่มเพื่อรีทำการรีเซ็ตรหัสผ่านใหม่
                                            </p>
                                            <a href="http://localhost:9090/Forgotpassword/resetpassword/${Token}" style="border:none;cursor:pointer;background:#FF9190;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:20px;padding:10px 24px;display:inline-block;border-radius:50px;text-align:center;">รีเซ็ตรหัสผ่าน</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:40px;">&nbsp;</td>
                                    </tr>
                                </table>
                            </td>
                        <tr>
                            <td style="height:20px;">&nbsp;</td>
                        </tr>
                        <tr>
                            <td style="height:80px;">&nbsp;</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>`,
            };
            await transport
            .sendMail(mailOptions)
            .then(res.status(200).json({ message: "Request sent successfully please check your Email" }));
        } catch (error) {
            res.json({ message: `${error}` });
        }
}

const tokensendemail = (req: Request, res: Response, next: NextFunction) => {
    jwt.verify(
      req.params.token,
      config.token,
      (err: any, user: any) => {
        if (err) {
          console.log("tokeneex");
          res.render("tokenex");
        } else {
          res.render("resetpassword", { error: "" });
          console.log(req.body.password);
        }
      }
    );
  };

  const Presetpassword = async(req: Request, res: Response, next: NextFunction) => {
    const password: string = req.body.password;
    const confirmpassword: string = req.body.confirmpassword;
    const Usertoken: any = jwt.verify(req.params.token, config.token);
    console.log(req.body.password);
    console.log(req.body.confirmpassword);
    console.log(Usertoken.email)
    if (password.length < 6) {
      return res.render("resetpassword", {
        error: "รหัสผ่านต้องไม่ต่ำกว่า 6 ตัวอักษร",
      });
    } else if (password === confirmpassword) {
    await bycript.hash(req.body.password, 10).then(async(hashpassword:string) => {
        await AppDataSource
                .createQueryBuilder()
                .update(User)
                .set({
                    password:hashpassword
                })
                .where("email = :email", { email: Usertoken.email }).execute()
                res.render("success", { success: "รีเซตรหัสผ่านแล้ว!!" })
      });
    } else {
      return res.render("resetpassword", { error: "ใส่รหัสผ่านไม่ตรงกัน!!" });
    }
  };

  const RecoveryEmail = async(req: Request, res: Response, next: NextFunction) => {
    const {recipient_email,otp} = req.body;
    console.log(recipient_email,otp)
    return new Promise((resolve, reject) => {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: config.host.EMAIL_HOST,
            pass: config.host.PASSCODE_HOST,
          },
        });
    
        const mail_configs = {
          from: config.host.EMAIL_HOST,
          to: recipient_email,
          subject: "มีการขอรีเซ็ตรหัสผ่านด้วยอีเมลของคุณ",
          html: `<html>
          <head>
              <title>Reset Password</title>
              <meta charset="UTF-8">
          <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
          <title>Reset Password Email Template</title>
          <meta name="description" content="Reset Password Email Template.">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600&display=swap" rel="stylesheet">
          <style type="text/css">
              a:hover {text-decoration: underline !important;}
              *{
      font-family: "Kanit", sans-serif;
              }
          </style>
          </head>
      <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
          <!--100% body table-->
          <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
              style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: "Open Sans", sans-serif;">
              <tr>
                  <td>
                      <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                          align="center" cellpadding="0" cellspacing="0">
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="text-align:center;">
                              <a href="" title="logo" target="_blank">
                                  <img width="160" src="https://cdn.discordapp.com/attachments/751142632788590696/1107406392547082420/image.png" title="logo" alt="logo">
                              </a>
                              </td>
                          </tr>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td>
                                  <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                      style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                          <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:"Rubik",sans-serif;">
                                                  รีเซ็ตรหัสผ่าน
                                                </h1>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                  มีการขอรีเซ็ตรหัสผ่านด้วยอีเมลของคุณ
                                                </p>
                                              <span
                                                  style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                              <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                  ใช้รหัส OTP ต่อไปนี้เพื่อทําตามขั้นตอนการกู้คืนรหัสผ่านให้เสร็จสมบูรณ์
                                              </p>
                                              <br>
                                              <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0px 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td style="height:40px;">&nbsp;</td>
                                      </tr>
                                  </table>
                              </td>
                          <tr>
                              <td style="height:20px;">&nbsp;</td>
                          </tr>
                          <tr>
                              <td style="height:80px;">&nbsp;</td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
    `,
        };
        transporter.sendMail(mail_configs, function (error, info) {
          if (error) {
            console.log(error);
            return reject({ message: `An error has occured` });
          }
          return resolve({ message: "Email sent succesfuly" });
        });
      });
  }


export default {ForgotPassword,tokensendemail,Presetpassword,RecoveryEmail};