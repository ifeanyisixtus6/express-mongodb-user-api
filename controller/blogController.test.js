import { createBlog, getBlogs, getBlogById, getMyBlog, updateBlogById, deleteBlogById} from "./blogController.js";
import blogModel from  "../model/blogModel.js"


/// mock the blogModel
jest.mock("../model/blogModel.js");

describe("blogControler", () => {
let req, res, next;

beforeEach(() => {
    req ={body: {}, params: {}, user: {}};
    res = {status: jest.fn().mockReturnThis(), json: jest.fn(), cookies: jest.fn()};
    next = jest.fn(), jest.clearAllMocks()
})


describe("createBlog", () => {
    it("it should return 400 if the title and content are empty", async () => {
        req.body = {}, {};

        await createBlog(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Title And Content Are Mandatory"})
    })
})
})
