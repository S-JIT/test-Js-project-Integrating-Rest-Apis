const URL = "https://crudcrud.com/api/aeb6dea56d9f4d8e97db5f853f64936c/blog";

// Function to handle form submission to post a new blog
async function postBlog(event) {
  event.preventDefault();

  // Get form values
  let imageUrl = document.getElementById("imageUrl").value;
  let blogTitle = document.getElementById("blogTitle").value;
  let blogDescription = document.getElementById("blogDescription").value;

  try {
    // Send POST request to create a new blog
    let response = await axios.post(URL, {
      imageUrl: imageUrl,
      blogTitle: blogTitle,
      blogDescription: blogDescription
    });

    // Show the created blog on the page
    showOnScreen(response.data);

    // Reset form fields
    document.getElementById("imageUrl").value = "";
    document.getElementById("blogTitle").value = "";
    document.getElementById("blogDescription").value = "";

    // Update total blog count
    updateTotalBlogCount(1);
  } catch (error) {
    console.error("Error posting blog:", error);
  }
}

// Function to fetch and display existing blogs
async function displayBlogs() {
  try {
    // Send GET request to fetch existing blogs
    let response = await axios.get(URL);
    response.data.forEach(blog => {
      showOnScreen(blog);
    });

    // Update total blog count
    updateTotalBlogCount(response.data.length);
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
}

// Function to show a blog on the browser page
function showOnScreen(blog) {
  let blogList = document.getElementById("blogList");

  let blogItem = document.createElement("div");
  blogItem.classList.add("blog");
  blogItem.innerHTML = `
      <img src="${blog.imageUrl}" alt="Blog Image">
      <h2>${blog.blogTitle}</h2>
      <p>${blog.blogDescription}</p>
      <button onclick="editBlog('${blog._id}')">Edit</button>
      <button onclick="deleteBlog('${blog._id}')">Delete</button>
  `;

  blogList.appendChild(blogItem);
}

// Function to edit a blog post
async function editBlog(blogId) {
  // Retrieve blog data
  let imageUrl = document.getElementById("imageUrl").value;
  let blogTitle = document.getElementById("blogTitle").value;
  let blogDescription = document.getElementById("blogDescription").value;

  try {
    // Send PUT request to update the blog
    await axios.put(`${URL}/${blogId}`, {
      imageUrl: imageUrl,
      blogTitle: blogTitle,
      blogDescription: blogDescription
    });

    // Remove the blog from the DOM and update
    let blogItem = document.getElementById(blogId);
    blogItem.remove();
    showOnScreen({ _id: blogId, imageUrl, blogTitle, blogDescription });
  } catch (error) {
    console.error("Error editing blog:", error);
  }
}

// Function to delete a blog post
async function deleteBlog(blogId) {
  try {
    // Send DELETE request to delete the blog
    await axios.delete(`${URL}/${blogId}`);

    // Remove the blog from the DOM
    let blogItem = document.getElementById(blogId);
    blogItem.remove();

    // Update total blog count
    updateTotalBlogCount(-1);
  } catch (error) {
    console.error("Error deleting blog:", error);
  }
}

// Function to update the total blog count
function updateTotalBlogCount(change) {
  let totalBlogCount = document.getElementById("totalBlogCount");
  totalBlogCount.textContent = parseInt(totalBlogCount.textContent) + change;
}

// Event listener to call displayBlogs function when the DOM content is loaded
window.addEventListener("DOMContentLoaded", displayBlogs);
