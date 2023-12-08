let input = document.querySelector(".input");
let sendButton = document.querySelector(".send");
let deleteButtons = document.querySelectorAll(".delete");
let allContainer = document.querySelector(".all-container");
let replyButtons = document.querySelectorAll(".reply");
let replyReplyBtns = document.querySelectorAll(".reply-reply");
let currentUserImage = document.querySelector(".current-user-image");

fetch("./data.json")
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    currentUserImage.src = data.currentUser.image.png;
  });

function fetchCurrentUserImage(userImage) {
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      userImage.src = data.currentUser.image.png;
    });
}

let comments = [];
let fetchedCommentsArray = [];
let replies = [];
let increment = 0;
let increment2 = 0;

if (localStorage.getItem("comments")) {
  comments = JSON.parse(localStorage.getItem("comments"));
}

if (localStorage.getItem("replies")) {
  replies = JSON.parse(localStorage.getItem("replies")) || [];
}

getComments();

sendButton.onclick = (e) => {
  if (input.value !== "") {
    addCommentsToArray(input.value); // Add Task to Array Of Tasks
    // e.target.parentElement.parentElement.previousSibling.previousSibling.children[
    //   increment3
    // ].setAttribute("data-id", increment3);
    input.value = ""; // Empty the input after typing
  }
};

function addCommentsToArray(inputValue) {
  const comment = {
    title: inputValue,
    id: comments.length,
  };
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      comment.user = {
        image: {
          png: data.currentUser.image.png,
        },
        username: "Ahmed",
      };
      // newComment = {
      //   ...comment,
      //   user: {
      //     image: {
      //       png: data.currentUser.image.png,
      //     },
      //     username: "Ahmed",
      //   },
      // };
      comments.push(comment);
      addCommentsToLocalStorage(comments);
      // Add comments To Page
      createComment(comments);
    });

  // Push comment to array of comments

  // Add comments to local storage
}

// function addRepliesToArray(inputValue) {
//   const reply = {
//     title: inputValue,
//   };

//   // Push reply to array of replies
//   replies.push(reply);
//   // Add replies To Page
//   createReply(replies);
//   // Add replies to local storage
//   addRepliesToLocalStorage(replies);
// }

// async function fetchComments(file) {
//   let content;
//   let div = document.createElement("div");
//   let myObject = await fetch(file);
//   let data = await myObject.json();

//   for (let i = 0; i < data.comments.length; i++) {
//     // content = `<div class="comment-thread-renderer other" id="${data.comments[0].id}"><div class="container saved"><div class="comment"><div class="other-user-container"><img class="other-user-image" src="${data.comments[0].user.image.png}"><div>Ahmed</div><div class="comment-date">2 minutes ago</div></div><button class="delete">Delete</button><button class="reply">Reply</button></div><div class="comment-text">${data.comments[0].content}</div></div></div>`;
//     const comment = {
//       title: data.comments[i].content,
//       username: data.comments[i].user.username,
//       userImage: data.comments[i].user.image.png,
//       id: data.comments[i].id,
//       dataId: Math.random(),
//     };
//     // comment.title = data.comments[i].content;
//     // comment.username = data.comments[i].user.username;
//     // comment.userImage = data.comments[i].user.image.png;
//     // comment.id = data.comments[i].id;
//     fetchedCommentsArray.push(comment);

//     // Add comments to local storage
//     addFetchedCommentToLocalStorage(fetchedCommentsArray);
//     // Add comments To Page
//   }
//   // div.innerHTML = content;
//   fetchedComments(fetchedCommentsArray);

//   // <div class="comment-thread-renderer"><div class="container saved"><div class="comment"><div class="current-user-image-container"><img class="current-user-image" src=""></div><button class="delete">Delete</button><button class="reply">Reply</button></div><div class="comment-text"></div></div><div class="reply-container"><div class="comment"><div class="current-user-image-container"><img class="current-user-image" src=""></div><button class="delete">Delete</button><button class="reply">Reply</button></div><div class="comment-text"></div></div></div>
// }
let hasRun = false;

async function myAsyncFunction() {
  console.log("Running async function");
  // const response = await yourAsyncFunction(); // Replace with the path to your JSON file
  const response = await fetch("./data.json"); // Replace with the path to your JSON file
  const data = await response.json();

  // Assuming your JSON structure is like { comments: [...], replies: [...] }
  const { commentss } = data;

  // Update local storage with fetched data
  // localStorage.setItem("replies", JSON.stringify(replies));

  for (let i = 0; i < commentss.length; i++) {
    comments.push(commentss[i]);
    let repliess = commentss[i].replies;
    for (let i = 0; i < repliess.length; i++) {
      replies.push(repliess[i]);
      fetchedReplies(commentss[i].id);
    }
  }
  localStorage.setItem("replies", JSON.stringify(replies));
  localStorage.setItem("comments", JSON.stringify(comments));
}

function fetchedReplies(commentId) {
  // let repliesData = localStorage.getItem("replies");
  // let replies = JSON.parse(repliesData) || [];

  let commentContainer = document.getElementById(commentId);

  if (commentContainer) {
    // Clear existing replies
    if (commentContainer.querySelector(".reply-container")) {
      commentContainer.querySelector(".reply-container").innerHTML = "";
    }

    // Append the replies to the comment container

    comments.forEach((reply) => {
      reply.replies
        .filter((reply) => reply.index === commentId)
        .forEach((reply) => {
          console.log(reply);
          let container = document.createElement("div");
          container.classList.add("reply-container");
          container.style.width = "70%";
          container.style.transform = "translate(50px)";

          let comment = document.createElement("div");
          comment.classList.add("comment");

          let commentText = document.createElement("div");
          commentText.classList.add("comment-text");
          commentText.innerText = reply.title;

          let replyBtn = document.createElement("button");
          replyBtn.classList.add("reply");
          replyBtn.innerText = "Reply";

          replyBtn.addEventListener("click", (e) => {
            replyOnAcomment(e);
            container.id = increment2;
            e.target.parentElement.parentElement.nextSibling
              .querySelector("input")
              .focus();
          });

          let userContainer = document.createElement("div");
          userContainer.classList.add("current-user-container");

          let userImage = document.createElement("img");
          userImage.classList.add("current-user-image");
          userImage.src = reply.user.image.png;
          let userName = document.createElement("div");
          userName.innerText = reply.user.username;

          let userCommentDate = document.createElement("div");
          userCommentDate.classList.add("comment-date");
          userCommentDate.innerText = reply.createdAt;

          let deleteButton = document.createElement("button");
          deleteButton.classList.add("delete");
          deleteButton.innerText = "Delete";
          container.id = reply.containerId;
          deleteButton.addEventListener("click", (e) => {
            let repliesData = localStorage.getItem("replies");
            let replies = JSON.parse(repliesData) || [];
            let updatedReplies = replies.filter(
              (reply) =>
                reply.containerId !== e.target.parentElement.parentElement.id
            );
            localStorage.setItem("replies", JSON.stringify(updatedReplies));
            console.log(updatedReplies);

            container.remove();
          });

          userContainer.appendChild(userImage);
          userContainer.appendChild(userName);
          userContainer.appendChild(userCommentDate);
          comment.appendChild(userContainer);
          comment.appendChild(deleteButton);
          comment.appendChild(replyBtn);
          container.appendChild(comment);
          container.appendChild(commentText);
          // Find the parent comment by ID and append the reply to it
          commentContainer.appendChild(container);
        });
    });
  }
}

async function runOnceAsyncFunction() {
  if (!localStorage.getItem("hasRun")) {
    try {
      await myAsyncFunction();
      // Set the flag in localStorage to indicate that the function has run
    } catch {}
    localStorage.setItem("hasRun", true);
  }
}
// Example usage

// function fetchedComments(comments) {
//   comments.forEach((item, id) => {
//     let commentThreadRenderer = document.createElement("div");
//     commentThreadRenderer.classList.add("comment-thread-renderer");
//     commentThreadRenderer.setAttribute("data-id", item.dataId);
//     let container = document.createElement("div");
//     container.classList.add("container");
//     container.classList.add("saved");

//     let comment = document.createElement("div");
//     comment.classList.add("comment");

//     let commentText = document.createElement("div");
//     commentText.classList.add("comment-text");

//     commentText.innerText = item.title;

//     let userContainer = document.createElement("div");
//     userContainer.classList.add("other-user-container");

//     let userImage = document.createElement("img");
//     userImage.classList.add("other-user-image");
//     userImage.src = item.userImage;
//     let userName = document.createElement("div");
//     userName.innerText = item.username;

//     let userCommentDate = document.createElement("div");
//     userCommentDate.classList.add("comment-date");
//     userCommentDate.innerText = "2 minutes agao";
//     let reply = document.createElement("button");
//     reply.classList.add("reply");

//     reply.innerText = "Reply";
//     let deleteButton = document.createElement("button");
//     deleteButton.classList.add("delete");

//     deleteButton.innerText = "Delete";

//     reply.addEventListener("click", (e) => {
//       replyOnAcomment(e);
//       e.target.parentElement.parentElement.nextSibling
//         .querySelector("input")
//         .focus();
//     });

//     userContainer.appendChild(userImage);
//     userContainer.appendChild(userName);
//     userContainer.appendChild(userCommentDate);
//     comment.appendChild(userContainer);
//     comment.appendChild(deleteButton);
//     comment.appendChild(reply);
//     container.appendChild(comment);
//     container.appendChild(commentText);
//     commentThreadRenderer.id = item.id;

//     commentThreadRenderer.appendChild(container);

//     allContainer.appendChild(commentThreadRenderer);
//     deleteButton.addEventListener("click", (e) => {
//       commentThreadRenderer.remove();
//       e.target.parentElement.parentElement.parentElement.remove();
//       deleteFetchedComments(id, item.id);
//     });
//   });

//   getReplies();
// }
// fetchComments("./data.json");

function createComment(comments) {
  document.querySelectorAll(".container").forEach((div) => div.remove());
  comments.forEach((item, id) => {
    let commentThreadRenderer = document.createElement("div");
    commentThreadRenderer.classList.add("comment-thread-renderer");

    let container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("saved");
    let comment = document.createElement("div");
    comment.classList.add("comment");

    let subContainer = document.createElement("div");
    subContainer.classList.add("sub-contaioner");

    let commentText = document.createElement("div");
    commentText.classList.add("comment-text");

    commentText.innerText = item.title;

    let userContainer = document.createElement("div");
    userContainer.classList.add("current-user-container");

    let userImage = document.createElement("img");
    userImage.classList.add("current-user-image");
    userImage.src = item.user.image.png;

    let userName = document.createElement("div");
    userName.innerText = item.user.username || "Ahmed";

    let userCommentDate = document.createElement("div");
    userCommentDate.classList.add("comment-date");
    userCommentDate.innerText = item.createdAt;

    let reply = document.createElement("button");
    reply.classList.add("reply");

    reply.innerText = "Reply";
    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.addEventListener("click", (e) => {
      commentThreadRenderer.remove();
      deleteComment(id, item.id);
    });
    deleteButton.innerText = "Delete";

    reply.addEventListener("click", (e) => {
      replyOnAcomment(e);
      e.target.parentElement.parentElement.nextSibling
        .querySelector("input")
        .focus();
    });

    userContainer.appendChild(userImage);
    userContainer.appendChild(userName);
    userContainer.appendChild(userCommentDate);
    comment.appendChild(userContainer);
    comment.appendChild(deleteButton);
    comment.appendChild(reply);
    container.appendChild(comment);
    container.appendChild(commentText);
    commentThreadRenderer.id = item.id;

    commentThreadRenderer.appendChild(container);

    allContainer.appendChild(commentThreadRenderer);
  });

  getReplies();
}
runOnceAsyncFunction();

function addCommentsToLocalStorage(comments) {
  localStorage.setItem("comments", JSON.stringify(comments));
}

// function addFetchedCommentToLocalStorage(fetchedComments) {
//   localStorage.setItem("fetched-comments", JSON.stringify(fetchedComments));
// }
function addRepliesToLocalStorage(replies) {
  localStorage.setItem("replies", JSON.stringify(replies));
}

function getComments() {
  let data = localStorage.getItem("comments");
  if (data) {
    let commment = JSON.parse(data);
    createComment(commment);
  }
}

function deleteComment(id, commentId) {
  comments.splice(parseInt(id), 1);
  localStorage.setItem("comments", JSON.stringify(comments));

  let repliesData = localStorage.getItem("replies");
  let replies = JSON.parse(repliesData) || [];
  let updatedReplies = replies.filter((reply) => reply.index !== commentId);
  localStorage.setItem("replies", JSON.stringify(updatedReplies));
  createComment(comments);
}
// function deleteFetchedComments(id, commentId) {
//   fetchedCommentsArray.splice(parseInt(id), 1);
//   localStorage.setItem(
//     "fetched-comments",
//     JSON.stringify(fetchedCommentsArray)
//   );

//   let repliesData = localStorage.getItem("replies");
//   let replies = JSON.parse(repliesData) || [];
//   let updatedReplies = replies.filter((reply) => reply.index !== commentId);
//   localStorage.setItem("replies", JSON.stringify(updatedReplies));
//   fetchedComments(fetchedCommentsArray);
//   appendRepliesToComment(commentId);
// }

function appendRepliesToComment(commentId) {
  let repliesData = localStorage.getItem("replies");
  let replies = JSON.parse(repliesData) || [];

  let commentContainer = document.getElementById(commentId);

  if (commentContainer) {
    // Clear existing replies
    if (commentContainer.querySelector(".reply-container")) {
      commentContainer.querySelector(".reply-container").innerHTML = "";
    }

    // Append the replies to the comment container

    replies
      .filter((reply) => reply.index === commentId)
      .forEach((reply) => {
        let commentText = document.createElement("div");
        commentText.classList.add("comment-text");
        commentText.innerText = reply.title;

        commentContainer.querySelector(".reply-container").append(commentText);
      });
  }
}
replyButtons.forEach((reply) => {
  reply.addEventListener("click", (e) => {
    replyOnAcomment(e);
    e.target.parentElement.parentElement.nextSibling
      .querySelector("input")
      .focus();
  });
});

let increment3 = 0;

// Function to add replies to the page from local storage
function getReplies() {
  let data = localStorage.getItem("replies");
  let replies = JSON.parse(data) || [];

  // Iterate over the replies and create HTML elements for each
  replies.forEach((reply) => {
    // Assuming each reply has a structure like { parentId: 1, text: "Reply text" }
    let container = document.createElement("div");
    container.classList.add("reply-container");
    container.style.width = "70%";
    container.style.transform = "translate(50px)";

    let comment = document.createElement("div");
    comment.classList.add("comment");

    let commentText = document.createElement("div");
    commentText.classList.add("comment-text");
    commentText.innerText = reply.title;

    let replyBtn = document.createElement("button");
    replyBtn.classList.add("reply");
    replyBtn.innerText = "Reply";

    replyBtn.addEventListener("click", (e) => {
      replyOnAcomment(e);
      container.id = increment2;
      e.target.parentElement.parentElement.nextSibling
        .querySelector("input")
        .focus();
    });

    let userContainer = document.createElement("div");
    userContainer.classList.add("current-user-container");

    let userImage = document.createElement("img");
    userImage.classList.add("current-user-image");
    userImage.src = reply.user.image.png;
    let userName = document.createElement("div");
    userName.innerText = reply.user.username;

    let userCommentDate = document.createElement("div");
    userCommentDate.classList.add("comment-date");
    userCommentDate.innerText = reply.createdAt;

    input.value = "";

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerText = "Delete";
    container.id = reply.containerId;
    deleteButton.addEventListener("click", (e) => {
      let repliesData = localStorage.getItem("replies");
      let replies = JSON.parse(repliesData) || [];
      let updatedReplies = replies.filter(
        (reply) => reply.containerId !== e.target.parentElement.parentElement.id
      );
      localStorage.setItem("replies", JSON.stringify(updatedReplies));
      console.log(updatedReplies);

      container.remove();
    });

    userContainer.appendChild(userImage);
    userContainer.appendChild(userName);
    userContainer.appendChild(userCommentDate);
    comment.appendChild(userContainer);
    comment.appendChild(deleteButton);
    comment.appendChild(replyBtn);
    container.appendChild(comment);
    container.appendChild(commentText);
    // Find the parent comment by ID and append the reply to it
    let parentComment = document.getElementById(reply.index);
    if (parentComment) {
      parentComment.appendChild(container);
    }
  });
}
// getReplies();
// Call the function to add replies to the page when the page loads
// document.addEventListener("DOMContentLoaded", getReplies);

function createReply2(e, sendSection, value) {
  document.querySelectorAll(".reply-container").forEach((div) => div.remove());

  const replyItem = {
    title: value,
  };

  let container = document.createElement("div");
  container.classList.add("reply-container");

  let comment = document.createElement("div");
  comment.classList.add("comment");

  let commentText = document.createElement("div");
  commentText.classList.add("comment-text");

  commentText.innerText = replyItem.title;

  for (let i = 0; i < allContainer.children.length; i++) {
    if (
      e.target.parentElement.parentElement.parentElement.parentElement ===
      allContainer.children[i]
    ) {
      replyItem.index = i;
    }
  }
  let reply = document.createElement("button");
  reply.classList.add("reply");
  reply.innerText = "Reply";

  reply.addEventListener("click", (e) => {
    replyOnAcomment(e);
    container.id = increment2;
    e.target.parentElement.parentElement.nextSibling
      .querySelector("input")
      .focus();
  });

  input.value = "";

  let deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.innerText = "Delete";

  container.setAttribute("data-id", Math.random());
  replyItem.containerId = container.getAttribute("data-id");
  deleteButton.addEventListener("click", (e) => {
    let repliesData = localStorage.getItem("replies");
    let replies = JSON.parse(repliesData) || [];
    let updatedReplies = replies.filter(
      (reply) =>
        reply.containerId !==
        e.target.parentElement.parentElement.getAttribute("data-id")
    );

    localStorage.setItem("replies", JSON.stringify(updatedReplies));

    container.remove();
  });
  let userContainer = document.createElement("div");
  userContainer.classList.add("current-user-container");

  let userImage = document.createElement("img");
  userImage.classList.add("current-user-image");

  let userName = document.createElement("div");
  userName.innerText = "Ahmed";

  let userCommentDate = document.createElement("div");
  userCommentDate.classList.add("comment-date");
  userCommentDate.innerText = "2 minutes agao";

  fetchCurrentUserImage(userImage);
  userContainer.appendChild(userImage);
  userContainer.appendChild(userName);
  userContainer.appendChild(userCommentDate);
  comment.appendChild(userContainer);
  comment.appendChild(deleteButton);
  comment.appendChild(reply);
  container.appendChild(comment);
  container.appendChild(commentText);
  // if (
  //   e.target.parentElement.parentElement.parentElement.previousSibling.classList.contains(
  //     "container"
  //   )
  // ) {
  //   allContainer.append(container);
  //   container.style.width = "auto";
  //   container.style.transform = "0%";
  // } else {
  //   e.target.parentElement.parentElement.parentElement.after(container);
  //   container.style.width = "70%";
  //   container.style.transform = "translate(50px)";
  // }
  e.target.parentElement.parentElement.parentElement.parentElement.append(
    container
  );
  // increment3 += 1;

  container.style.width = "70%";
  container.style.transform = "translate(50px)";
  // if (
  //   !e.target.parentElement.parentElement.parentElement.nextSibling.classList.contains(
  //     sendSection.className
  //   )
  // ) {
  //   increment = 0;
  // }
  let children = container.parentElement.children;
  // for (let i = 0; i < children.length; i++) {
  //   if (children[i].classList.contains("reply-container")) {
  //     replyItem.containerId = i;
  //     container.setAttribute("data-id", i);
  //   }
  // }

  replyItem.container = container.innerHTML;
  let data = localStorage.getItem("replies");
  let replies = JSON.parse(data) || [];
  replies.push(replyItem);
  addRepliesToLocalStorage(replies);
  sendSection.remove();
}

function replyOnAcomment(e) {
  let sendSection = document.createElement("div");
  sendSection.classList.add("reply-section");

  let inputField = document.createElement("div");
  inputField.classList.add("reply-field");
  inputField.name = "form";

  let buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  let input = document.createElement("input");
  input.classList.add("reply-input");
  input.placeholder = "Add a comment";

  let sendButton = document.createElement("button");
  sendButton.classList.add("reply-reply");
  sendButton.innerText = "Reply";

  let cancel = document.createElement("button");
  cancel.classList.add("cancel");
  cancel.innerText = "Cancel";

  inputField.appendChild(input);
  buttonsContainer.appendChild(cancel);
  buttonsContainer.appendChild(sendButton);
  inputField.appendChild(buttonsContainer);
  sendSection.appendChild(inputField);
  increment += 1;

  e.target.parentElement.parentElement.id = increment;
  e.target.parentElement.parentElement.after(sendSection);
  sendButton.onclick = (e) => {
    if (input.value != "") {
      createReply2(e, sendSection, input.value);
    }
  };

  // After adding a new reply, update the local storage

  cancel.onclick = () => {
    let nextSibling = e.target.parentElement.parentElement.nextSibling;
    if (nextSibling && nextSibling.classList.contains(sendSection.className)) {
      // Reset increment or perform other necessary actions
      increment = 0;
    }
    sendSection.remove();
  };
}
