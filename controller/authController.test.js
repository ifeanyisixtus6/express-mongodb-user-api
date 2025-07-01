import authUser from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { register,login } from "./authController.js";



jest.mock("../model/userModel.js", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
   create: jest.fn(), 
  },
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(), 
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}))



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

   it("it should return 201 and create user successfully", async () => {

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

   describe("login", () => {
    it("it should return 400 if Email or Password is missing", async () => {
        req.body = {};

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Email or Password is missing!"})
    })

    it("it should return 401 if Email or Password is invalid", async () => {
      req.body = {email: "ify2@yopmail.com", password: "12345edrf"}

      //const mockUser = {email: "ify2@yopmail.com"}

      authUser.findOne.mockResolvedValue(null)

      await login(req, res)

      expect(res.status).toHaveBeenCalledWith(401)
      expect(res.json).toHaveBeenCalledWith({message: "Invalid email or password"})

    })
    
it("should return 200 and accessToken if credentials are valid", async () => {

        req = {
  body: {
    email: "ify@yopmail.com",
    password: "123456",
  },
};

    const mockUser = {
      _id: "user123",
      firstName: "Sixtus",
      lastName: "Attah",
      email: "ify@yopmail.com",
      password: "hashedpw",
      role: "user",
    };


    authUser.findOne.mockResolvedValue(mockUser);      
    bcrypt.compare.mockResolvedValue(true);            
    jwt.sign.mockReturnValue("mockedToken123");       

  
    await login(req, res, next);

   
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      accessToken: "mockedToken123",
      user: {
        id: "user123",
        firstName: "Sixtus",
        lastName: "Attah",
        email: "ify@yopmail.com",
        role: "user",
      },
    });
})
})
})