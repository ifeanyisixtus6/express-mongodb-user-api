import {
  getAllUsers,
  getUserById,
  updateUserById,
  softDeleteUser,
   deleteUserById,
} from "./userController.js";

import UserModel from "../model/userModel.js";

// Mock UserModel
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
        { firstName: "ifeanyichukwu", email: "ify@yopmail.com" },
        { firstName: "ugochi", email: "ugochi@yopmail.com" },
      ];
      UserModel.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });

      await getAllUsers(req, res, next);

      expect(UserModel.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should call next with error on failure", async () => {
      const error = new Error("Database failure");
      UserModel.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(error)
      });

      await getAllUsers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });


  describe("getUserById", () => {
    it("should return 403 if unauthorized", async () => {
      req.user = { id: "123", role: "user" };
      req.params.id = "999";

      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: "Not authorized" });
    });

    it("should return 404 if user not found", async () => {
      req.user = { id: "123", role: "user" };
      req.params.id = "123";
      UserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should return user if found", async () => {
      const mockUser = { firstName: "Attah", email: "attah@yopmail.com" };
      req.user = { id: "123", role: "user" };
      req.params.id = "123";
      UserModel.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await getUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should call next on failure", async () => {
      const error = new Error("Database failure");
      req.user = { id: "123", role: "user" };
      req.params.id = "123";
      UserModel.findById.mockReturnValue({
        select: jest.fn().mockRejectedValue(error)
      });

      await getUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("updateUserById", () => {
    it("should return 403 if unauthorized", async () => {
      req.user = { id: "12", role: "user" };
      req.params.id = "123";

      await updateUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 404 if user not found", async () => {
      req.user = { id: "123", role: "user" };
      req.params.id = "123";
      UserModel.findById.mockResolvedValue(null);

      await updateUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should update and return user", async () => {
      const mockUser = {
        _id: "123",
        email: "old@email.com",
        isDeleted: false,
      };
      const updatedUser = { ...mockUser, firstName: "Updated" };

      req.user = { id: "123", role: "user" };
      req.params.id = "123";
      req.body = { firstName: "Updated" };

      UserModel.findById.mockResolvedValue(mockUser);
      UserModel.findOne.mockResolvedValue(null); 
      UserModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

      await updateUserById(req, res, next);

      expect(UserModel.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User Updated successfully",
        data: updatedUser,
      });
    });

    it("should call next on failure", async () => {
      const error = new Error("Database failure");
      req.user = { id: "123", role: "user" };
      req.params.id = "123";
      UserModel.findById.mockRejectedValue(error);

      await updateUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });


describe("softDeleteUser", () => {
  it('should soft-delete user and return success message', async () => {
    const mockUser = { _id:122, isDeleted: true };
    
    req.params.id = 122;
    UserModel.findByIdAndUpdate.mockResolvedValue(mockUser);
    
    await softDeleteUser(req, res, next);
    
    expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(122, { isDeleted: true }, { new: true });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'User soft-deleted successfully' });
  });
  
  it('should return 404 if user not found', async () => {
    req.params.id = 'nonexistent122';
    UserModel.findByIdAndUpdate.mockResolvedValue(null);
    
    await softDeleteUser(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });
  
  it('should call next with error on failure', async () => {
    const error = new Error('Database error');
    req.params.id = 122;
    UserModel.findByIdAndUpdate.mockRejectedValue(error);
    
    await softDeleteUser(req, res, next);
    
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});

  describe("deleteUserById", () => {
    it("should return 403 if unauthorized", async () => {
      req.user = { id: "5", role: "user" };
      req.params.id = "3";

      await deleteUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 404 if user not found", async () => {
      req.user = { id: "3", role: "user" };
      req.params.id = "3";
      UserModel.findByIdAndDelete.mockResolvedValue(null);

      await deleteUserById(req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    });

    it("should delete user", async () => {
      const mockUser = {
        _id: "3",
        firstName: "Ugochi",
        email: "ugo@yopmail.com",
      };

      req.user = { id: "3", role: "user" };
      req.params.id = "3";

      UserModel.findByIdAndDelete.mockResolvedValue(mockUser);

      await deleteUserById(req, res, next);

      expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith("3");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User deleted successfully",
      });
    });

    it("should call next on error", async () => {
      const error = new Error("Delete failed");
      req.user = { id: "3", role: "user" };
      req.params.id = "3";
      UserModel.findByIdAndDelete.mockRejectedValue(error);

      await deleteUserById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});