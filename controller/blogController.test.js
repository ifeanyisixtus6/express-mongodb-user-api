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
        req.body = {}, 

        await createBlog(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({message: "Title And Content Are Mandatory"})
    })

    it("it should return 400 if the title already exist", async () => {
        req.body = { title: 'My Unique Blog Title',
            content: 'seamfix nextgen'}
       


            blogModel.findOne.mockResolvedValue({
                title: req.body.title, 
              });
          
              await createBlog(req, res, next);
          
              expect(res.status).toHaveBeenCalledWith(400);
              expect(res.json).toHaveBeenCalledWith({ message: 'Title Already Exists' });

    })

    it("it should respond with 201 and return a success message when a new blog is created", async () => {
        req = {body:{
            title: "nextgen Academy",
            content: "javascript fundamental",
        }, user: {id: "1234"}};

        blogModel.findOne.mockResolvedValue(null);

        const mockBlog = {
            _id: "1234b",
            title: req.body.title,
            content: req.body.content,
            author: req.user.id,
            populate: jest.fn()
        };
        const populatedBlog = {...mockBlog, author:{_id: "1234b", firstName: "ugochi", lastName: "Attah", email: "ugochiyop@gmail.com" } } 

        blogModel.create.mockResolvedValue(mockBlog);
    mockBlog.populate.mockResolvedValue(populatedBlog);

    await createBlog(req, res, next);

     
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Blog created successfully",
      blog: populatedBlog
    });
  });

  it("it should return 500 and error message on failure", async () => {
    const error = new Error("Database failure");

    req.body = {
        title: "nextgen academy",
        content: "cohort 6"
      };
      req.user = { id: "1234" };


    blogModel.create.mockRejectedValue(error);

    await createBlog(req, res);

    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({message: "Database failure"})

  } )
  })
  describe("getBlogs", () => {
    it("it should return all blogs with status 200", async () => {
    const populatedBlog = {_id: "1234b", firstName: "ugochi", lastName: "Attah", email: "ugochiyop@gmail.com" } 


 const mockFindResult = {
    populate: jest.fn().mockResolvedValue(populatedBlog)
  };

  blogModel.find.mockReturnValue(mockFindResult);

    await getBlogs(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({allBlogs: populatedBlog})

    })
    
    it("it should return blogs by id wiith a status 200", async () => {
        const blogs =  [{
            id: "1242", post: "nextgen", author: "ugochi"
        }]

        blogModel.find.mockResolvedValue(blogs);

        await getMyBlog(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({blogs})

    })
  })

  describe("getBlogById", () => {
    it("it should return 404 if blog is not found", async () => {
    req.params = {id: "htfvhwdcv5346y"}

    blogModel.findById.mockReturnValue({populate: jest.fn().mockResolvedValue(null)})

        await getBlogById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({message: "Blog not found"})
    })

    it("it should return 200 if the blog is found", async () => {
         const blog = {
            id: "453456", firstName: "nonso", lastName: "Ineh", email: "nonsoyop@gmail.com"
        }
        
  const req = {
    params: { id: "453456" }
  };

  blogModel.findById = jest.fn().mockReturnValue({
    populate: jest.fn().mockResolvedValue(blog)
  });


  await getBlogById(req, res)

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({blog});


    });

    it("it should return 500 and error message on failure", async () => {

      const req = {
        params: { id: "453456" }
      };

      const error = new Error("Database failure");
       

      blogModel.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(error)
      });
    
      // blogModel.findById = jest.fn().mockRejectedValue(error);

       await getBlogById(req, res);

       expect(res.status).toHaveBeenCalledWith(500);
       expect(res.json).toHaveBeenCalledWith({message: "Database failure"})
    })

  })

  describe("updateBlogById", () => {
    it("it should return 404 if blog is not found", async () => {
      req.params = {id: "34edrfv4t"};

      blogModel.findById = jest.fn().mockResolvedValue(null);

     await updateBlogById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({message: "Blog not found"})
    })

    it("it should return 403 if not authorized to update the blog", async () => {
      req = {body:{author: "5464erdtt5f"}, user:{id: "653rdgweft", role:"user"}, params:{id: "4632534rrt"}};
      

      const blog = {
        author: "5464erdtt5f" // blog belongs to a different user
      };
    
      blogModel.findById = jest.fn().mockResolvedValue(blog);
    
      
      await updateBlogById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({Error: "Not authorized to update this blog"})


    })
        it("should update the blog and return 200", async () => {
          req = {
            params: { id: "123abc" },
            body: { title: "Updated Title", content: "Updated Content" },
            user: { id: "user123", role: "user" },
          };
        
          const mockPopulatedBlog = {
            _id: "123abc",
            title: "Updated Title",
            content: "Updated Content",
            author: {
              firstName: "Nonso",
              lastName: "Ineh",
              email: "nonsoyop@gmail.com",
            },
          };
        
          const mockSavedBlog = {
            populate: jest.fn().mockResolvedValue(mockPopulatedBlog),
          };

          const mockBlog = {
            author: "user123",
            title: "Old Title",
            content: "Old Content",
            save: jest.fn().mockResolvedValue(mockSavedBlog),
          };
        
          blogModel.findById = jest.fn().mockResolvedValue(mockBlog);
        
          await updateBlogById(req, res);
        
          expect(blogModel.findById).toHaveBeenCalledWith("123abc");
          expect(mockBlog.save).toHaveBeenCalled();
          expect(res.status).toHaveBeenCalledWith(200);
          expect(res.json).toHaveBeenCalledWith({
            message: "Blog updated successfully",
            blog: mockPopulatedBlog,
          });
        });
      })
      
      describe("deleteBlogById", () => {
        it("it should return 404 if blog not found", async () => {
          req.params = {id: "5642ertdfc"};

          blogModel.findById = jest.fn().mockResolvedValue(null);

          await deleteBlogById(req, res);

          expect(res.status).toHaveBeenCalledWith(404);
          expect(res.json).toHaveBeenCalledWith({message: "Blog not found"})
        })
      })

      it("it should return 403 if not authorized to delete a blog", async () => {
req = {body:{author: "5464erdtt5f45"}, user:{id: "653rdgweft", role:"user"}, params:{id: "4632534rrt"}};
      

let blog = {
author: "5464erdtt5f" // blog belongs to a different user
};
    
      blogModel.findById = jest.fn().mockResolvedValue(blog);
      
      
      await deleteBlogById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({message: "Not authorized to delete this blog"})
      })

       it("it should return 200 if successfully deleted", async () => {
req = {body: {author: "37647886gt"}, user:{id: "653rdgweft", role:"user"}, params:{id: "4632534rrt"}};
      

let blog = {
author: "653rdgweft", // blog belongs to a different user
deleteOne: jest.fn().mockResolvedValue({})
};
    
      blogModel.findById = jest.fn().mockResolvedValue(blog);
   
      
      await deleteBlogById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({message: "Blog deleted successfully"})
      })

      it("it should retrun 500 and error message on failur", async () => {
        req = {body: {author: "37647886gt"}, user:{id: "653rdgweft", role:"user"}, params:{id: "4632534rrt"}};
  
//const error = new Error("Database failure");

      let blog = {
author: "653rdgweft", // blog belongs to a different user
deleteOne: jest.fn().mockRejectedValue(new Error("Database failure"))
};
      blogModel.findById = jest.fn().mockResolvedValue(blog)
    
      await deleteBlogById(req, res)
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({message: "Database failure"})
    })
  })
         