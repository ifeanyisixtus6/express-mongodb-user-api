import Blog from "../model/blogModel.js"


export const createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are mandatory" });
    }

    const existingPost = await Blog.findOne({ title });
    if (existingPost) {
      return res.status(400).json({ message: "Title already exists" });
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user.id
    });

    // Populated author info before sending response
    const populatedBlog = await blog.populate("author", "firstName lastName email");

    return res.status(201).json({ message: "Blog created successfully", blog: populatedBlog });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBlogs = async (req, res) => {
  try {
    const allBlogs = await Blog.find().populate("author", "firstName lastName email");
    return res.status(200).json(allBlogs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


export const getMyBlog = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user._id });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate("author", "firstName lastName email");

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(blog);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if logged-in user is the author
    if (blog.author.toString() !== req.user.id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ Error: "Not authorized to update this blog" });
    }

    const { title, content } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;

    const updatedBlog = await blog.save();
    const populatedBlog = await updatedBlog.populate("author", "firstName lastName email");

    return res.status(200).json({ message: "Blog updated successfully", blog: populatedBlog });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if logged-in user is the author
    if (blog.author.toString() !== req.user.id.toString() && re.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized to delete this blog" });
    }

    await blog.deleteOne();

    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};






