// Server URI
const API_URL = "http://localhost:8002";

// Query
const form = document.querySelector("form.tweet-form");
const loading = document.querySelector("div.loading");
const posts = document.querySelector("div.posts");

// Common Logic
loading.style.display = "none";

// Retrieve Data from Server
const getAllTweets = () => {
  posts.innerHTML = "";
  fetch(API_URL, {})
    .then((res) => res.json())
    .then((tweet) => {
      tweet.forEach((post) => {
        const div = document.createElement("div");
        const header = document.createElement("h3");
        const content = document.createElement("p");
        const date = document.createElement("small");
        const hr = document.createElement("hr");

        header.textContent = post.name;
        content.textContent = post.content;
        date.textContent = new Date(post.createdAt);

        div.appendChild(header);
        div.appendChild(content);
        div.appendChild(date);
        div.appendChild(hr);

        posts.appendChild(div);
      });
    })
    .catch((err) => console.log(err.messsage));
};

getAllTweets();

// Event
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const name = formData.get("name");
  const content = formData.get("content");

  const tweet = {
    name,
    content,
  };

  form.style.display = "none";
  loading.style.display = "";

  fetch(`${API_URL}/create`, {
    method: "POST",
    body: JSON.stringify(tweet),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      getAllTweets();
      setTimeout(() => {
        loading.style.display = "none";
        form.style.display = "";
        form.reset();
      }, 5000);
    })
    .catch((err) => console.log(err.message));
});
