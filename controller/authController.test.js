import authUser from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { register } from "./authController.js";



jest.mock("../model/userModel.js");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("authController", () => {
let req, res, next;

beforeEach(() => {
    req ={body: {}, params: {}, user: {}};
    res = {status: jest.fn().mockReturnThis(), json: jest.fn(), cookies: jest.fn()};
    next = jest.fn(), jest.clearAllMocks()
})

describe("register", () => {
   it("it should return 400 if any field is missing", async() => {
    req.body = {}

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({message: "All fields are mandatory"})
   })

   it("it should return 409 if email is already exists", async () => {
    req.body = {firstName: "Attah", lastName: "ify", email: "ifyy@yopmail.com", password: "123645cs"};

  authUser.findOne.mockResolvedValue({email: req.body.email})

  await register(req, res);

  expect(res.status).toHaveBeenCalledWith(409);
  expect(res.json).toHaveBeenCalledWith({message: "Email already exists"})
   })

   it("it should 201 and craete user successfully", async () => {

    req.body = {
    firstName: "Attah",
    lastName: "Ify",
    email: "ify@yopmail.com",
    password: "12345tee",
    role: "user"
  };

    const User = {_id: "user1234",
        firstName: "Attah", lastName: "Ify",  email: "ify@yopmail.com", password: "12345tee", role: "user"
    }

    authUser.findOne.mockResolvedValue(null);
    authUser.create.mockResolvedValue(User);

    jwt.sign.mockReturnValue("mocked-jwt-token");

    await register(req, res)

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({message: "User created successfully",
      accessToken: "mocked-jwt-token",
      user: {
        id: "user1234",
        firstName: "Attah",
        lastName: "Ify",
        email: "ify@yopmail.com",
        role: "user",
      },
    });
})
   })
})
