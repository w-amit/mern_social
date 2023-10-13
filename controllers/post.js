import Post from "../models/post.js";
import User from "../models/user.js";

export const createPost = async (req, res) => {
  try {
    const newPostData = {
      caption: req.body.caption,
      image: {
        public_id: "req.body.public_id",
        url: "req.body.url",
      },
      owner: req.user._id,
    };

    const post = await Post.create(newPostData);

    const user = await User.findById(req.user._id); // we will search the user in the database by id

    user.posts.push(post._id); // after getting the user we will push the post in the posts array of that user

    await user.save(); // save the new post

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ************* Deleting a Post *********
/* 1. There should be a post to delete 
2. We will compare the loggein user with the owner of the post(we will do so by converting the objectid)
3. If the post found and owner matches with the user logged in then we will remove the post
4. Since post is stored in the user as an array so we have to delete the user from the user database also
*/
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await Post.deleteOne({ _id: req.params.id });

    const user = await User.findById(req.user._id);

    const index = user.posts.indexOf(req.params.id);

    user.posts.splice(index, 1);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Post deleted",
    });
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: error.message,
    });
  }
};

export const likeAndUnlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id); // we will find the id from params

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // if the post has been already liked (how we will know that this user has liked the post - by its userId)
    if (post.likes.includes(req.user._id)) {
      //we have to search first the index since likes is storing in the array form in schema

      const index = post.likes.indexOf(req.user._id); // it will return us the index of the like post where it matches the user id

      post.likes.splice(index, 1); // splice is used to delete the data, it will take 1st parameter from where u have to start and the how many u have to delete

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    }

    // when user wants to like the post then we will send the id of the user that is logged in
    else {
      post.likes.push(req.user._id);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPostOfFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const posts = await Post.find({
      owner: {
        $in: user.following,
      },
      // in operator will search the user.following array and if the id matches with the post then it will return an array
    });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*const user = await User.findById(req.user._id).populate(
  "following",
  "posts"
);
// populate will give all the details of the following id */

export const updateCaption = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    post.caption = req.body.caption;

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Caption Updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Adding comment
export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // if the user has already added the comment then it will update the comment
    let commentIndex = -1;

    // checking if the comment exist or not

    post.comments.forEach((item, index) => {
      if (item.user.toString() === req.user._id.toString()) {
        commentIndex = index; // this will store the index whose id matches in the comment
      }
    });

    if (commentIndex !== -1) {
      post.comments[commentIndex].comment = req.body.comment;

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Comment Updated",
      });
    } else {
      // if there is no comment previously from the user
      post.comments.push({
        user: req.user._id,
        comment: req.body.comment,
      });

      await post.save();
      return res.status(200).json({
        success: true,
        message: "Comment added",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() === req.user._id.toString()) {
      if (req.body.commentId == undefined) {
        return res.status(400).json({
          success: false,
          message: "Comment Id is required",
        });
      }

      // if the owner of the post and comment owner is same

      post.comments.forEach((item, index) => {
        if (item._id.toString() === req.body.commentId.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Selected comment has deleted",
      });
    } else {
      // if the comment owner is different user

      // return isliye kyuki agar jab wo index find ho jayega tab wo return kar de nhi toh loop toh chalte rahegi aage bhi
      post.comments.forEach((item, index) => {
        if (item.user.toString() === req.user._id.toString()) {
          return post.comments.splice(index, 1);
        }
      });

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Your comment has deleted",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
