import { deleteUserById, getAllUsers, getUserById, updateUserById } from "./userController.js";
import UserModel from "../model/userModel.js";


// Mock the UserModel module
jest.mock("../model/userModel.js");

describe("userController", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, query: {}, params: {}, user: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe("getAllUsers", () => {
    it("should return all users with status 200", async () => {
      const mockUsers = [
        {
          firstName: "test",
          lastName: "User",
          email: "test@yopmail.com",
          role: "user",
        },
        {
          firstName: "admin",
          lastName: "One",
          email: "admin@yopmail.com",
          role: "admin",
        },
    ]
      UserModel.find.mockResolvedValue(mockUsers);

     
      await getAllUsers(req, res);

     expect(UserModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

it("should return 500 and error message on failure", async () => {
      const error = new Error("Database failure");

      UserModel.find.mockRejectedValue(error);

      await getAllUsers(req, res);

      
      expect(UserModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Database failure" });
    });
  });

  describe("getUserById", () => {
    it("should return 403 if user is not admin and trying to access another user's data", async () => {
      req.user = { id: "123", role: "user"};
      req.params.id = "143";
  
      await getUserById(req, res);
  
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({error: "Not authorized"})
    })
  })

  it("it should return 404 if user is not found", async () => {
    req.user = {}

    await getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({error: "User not found"})
  })

  it("it should return 200 if there is a user",  async () => {
    const mockUsers = [{
      firstName: "attah",
      lastName: "sixtus",
      email: "attah@yopmail.com",
      role: "user"
    },
  {
    firstName: "attah",
    lastName: "sixtus",
    email: "attah@yopmail.com",
    role: "admin"
  }
  ]

    UserModel.findById.mockResolvedValue(mockUsers)

    await getUserById(req, res);

    expect(UserModel.findById).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(mockUsers)
  })

  it("it should return 500 and error message on failure", async () => {
    const error = new Error("Database failure")

    UserModel.findById.mockRejectedValue(error);

    await getUserById(req, res);

    expect(UserModel.findById).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "Database failure"})
  })

  describe("updateUserById", () => {
    it("it should return 403 if the user is not admin and trying to access another user's data", async () => {
      req.user = {id: "923", role: "user"};
      req.params.id = "123"

      await updateUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({message: "Unauthorized"})
    })
  })

  it("it should return 404 if the user is not found", async () => {
    req.user = {};

    await updateUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({message: "User not found"})
  })

  it("it should return 200 if there is a user", async () => {
    const mockUsers = [{
      firstName: "ifeanyi",
      lastName: "Attah",
      email: "sixtusyop@gmail.com",
      role: "user"
    },
    {
      firstName: "peter",
      lastName: "okolie",
      email: "ifyyop@gmail.com",
      role: "admin"
    }
  ]
    UserModel.findByIdAndUpdate.mockResolvedValue(mockUsers);

    await updateUserById(req, res)

    expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({message: "User Updated successfully"})
  })

  it("it should return 500 and error mesage on failure", async () => {
    const error = new Error("Database failure");

    UserModel.findByIdAndUpdate.mockRejectedValue(error)

    await updateUserById(req, res);

    expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "Database failure"})
  })

  describe("deleteUserById", () => {
    it("it should return 403 if a user is not an admin and trying to access another user's data", async () => {
      req.user = {id: "234", role: "user"};
      req.params.id = "345";

      await deleteUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({message: "Unauthorized"})
    })

    it("it should return 404 if the user is not found", async () => {
      req.user = {};

      await deleteUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({message: "User not found"})

   })
   
   it("it should return 200 if a user is found", async () => {
    const mockUsers = [{
      firstName: "ugochi",
      lastName: "irene",
      email: "ugochiyop@email.com",
      role: "user",
    },
  {
    firstName: "nonso",
    lastName: "chris",
    email: "chrisyop@gmail.com",
    role: "admin"
  }
  ]

  UserModel.findByIdAndDelete.mockResolvedValue(mockUsers);

  await deleteUserById(req, res);

  expect(UserModel.findByIdAndDelete).toHaveBeenCalled()
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({message: "User deleted successfully"})
   })

   it("it should return 500 and error message on failure", async () => {
    const error = new Error ("Database failure");
     
    UserModel.findByIdAndDelete.mockRejectedValue(error);

    await deleteUserById(req, res);

    expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({message: "Database failure"})
   })
    })
  })
