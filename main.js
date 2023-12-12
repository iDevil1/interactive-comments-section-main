let input = document.querySelector(".input");
let sendButton = document.querySelector(".send");
let deleteButtons = document.querySelectorAll(".delete");
let allContainer = document.querySelector(".all-container");
let replyButtons = document.querySelectorAll(".reply");
let replyReplyBtns = document.querySelectorAll(".reply-reply");
let currentUserImage = document.querySelector(".current-user-image");
let commentThreadRenderers = document.querySelectorAll(
  ".comment-thread-renderer"
);

let comments = [];

function fetcheUserImage(image) {
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      image.src = data.currentUser.image.png;
    });
}
fetcheUserImage(currentUserImage);

function fetched() {
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      let dataComments = data.commentss;
      for (let i = 0; i < dataComments.length; i++) {
        object = {
          id: comments.length,
          title: dataComments[i].title,
          createdAt: dataComments[i].createdAt,
          score: dataComments[i].score,
          image: dataComments[i].user.image.png,
          username: dataComments[i].user.username,
          replies: dataComments[i].replies || [],
          updated: false,
        };
        comments.push(object);
        localStorage.setItem("comments", JSON.stringify(comments));
        displayComments(comments);
      }
      return data;
    });
}

let incrementComment = 1;
let incrementReply = 1;
function updateElements() {
  if (window.innerWidth < 450) {
    console.log();
    document.querySelectorAll(".reply").forEach((reply) => {
      reply.innerText = "";
      reply.style.bottom = "50px";
    });
    document.querySelectorAll(".edit-button").forEach((edit) => {
      edit.innerText = "";
      edit.style.bottom = "50px";
    });
    document.querySelectorAll(".delete").forEach((deleteBtn) => {
      deleteBtn.innerText = "";
      deleteBtn.style.bottom = "50px";
    });
  } else {
    document.querySelectorAll(".reply").forEach((reply) => {
      reply.innerText = "Reply";
      reply.style.bottom = "30px";
    });
    document.querySelectorAll(".edit-button").forEach((edit) => {
      edit.innerText = "Edit";
      edit.style.bottom = "20px";
    });
    document.querySelectorAll(".delete").forEach((deleteBtn) => {
      deleteBtn.innerText = "Delete";
      deleteBtn.style.bottom = "20px";
    });
  }
}

window.addEventListener("resize", updateElements);
window.addEventListener("load", updateElements);

function displayComments(comments) {
  allContainer.innerHTML = ""; // Clear existing content

  comments.forEach((item, id) => {
    let commentThreadRenderer = document.createElement("div");
    commentThreadRenderer.classList.add("comment-thread-renderer");
    commentThreadRenderer.id = item.id;

    let container = document.createElement("div");
    container.classList.add("container");

    let scoreContainer = document.createElement("div");
    scoreContainer.classList.add("score-container");

    let scoreIncrement = document.createElement("div");
    scoreIncrement.classList.add("score-increment");
    scoreIncrement.innerText = "+";

    let scoreElement = document.createElement("div");
    scoreElement.classList.add("score-element");
    scoreElement.innerText = item.score;
    let outerArray = JSON.parse(localStorage.getItem("comments")) || [];

    scoreIncrement.onclick = () => {
      if (!item.updated) {
        item.score = item.score + 1;
        scoreElement.innerText = item.score;
        item.updated = true; // Set the flag to indicate that the score has been updated
      }
      localStorage.setItem("comments", JSON.stringify(comments));
    };
    let scoreDecrement = document.createElement("div");
    scoreDecrement.classList.add("score-decrement");
    scoreDecrement.innerText = "-";
    scoreDecrement.onclick = () => {
      if (item.updated) {
        item.score = item.score - 1;
        scoreElement.innerText = item.score;
        item.updated = false; // Set the flag to indicate that the score has been updated
      }
      localStorage.setItem("comments", JSON.stringify(comments));
    };

    let comment = document.createElement("div");
    comment.classList.add("comment");

    let commentText = document.createElement("div");
    commentText.classList.add("comment-text");
    commentText.innerText = item.title;

    let userContainer = document.createElement("div");
    userContainer.classList.add("user-container");

    let youUser = document.createElement("div");
    youUser.classList.add("you");

    let buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("buttons-container");

    let editButton = document.createElement("button");
    editButton.classList.add("edit-button");
    editButton.innerText = "Edit";

    let cancel = document.createElement("button");
    cancel.classList.add("cancel");
    cancel.innerText = "cancel";

    let updateButton = document.createElement("button");
    updateButton.classList.add("update-button");
    updateButton.innerText = "Update";

    buttonsContainer.appendChild(cancel);
    buttonsContainer.appendChild(updateButton);

    let newInput = document.createElement("textarea");
    editButton.onclick = (e) => {
      newInput.placeholder = "Add a comment";
      newInput.value = commentText.innerText;
      container.appendChild(newInput);
      container.appendChild(buttonsContainer);
      newInput.focus();

      cancel.onclick = (e) => {
        newInput.remove();
        buttonsContainer.remove();
        container.appendChild(commentText);
      };

      updateButton.onclick = (e) => {
        if (newInput.value.trim() !== item.title) {
          item.title = newInput.value;
          commentText.innerText = item.title;
          localStorage.setItem("comments", JSON.stringify(comments));
          cancel.click();
        }
      };
      commentText.remove();
    };

    let userImage = document.createElement("img");
    userImage.classList.add("user-image");
    userImage.src = item.image;

    let userName = document.createElement("div");
    userName.classList.add("username");
    userName.innerText = item.username;

    let userCommentDate = document.createElement("div");
    userCommentDate.classList.add("comment-date");
    userCommentDate.innerText = item.createdAt;

    let reply = document.createElement("i");
    reply.classList.add("reply");
    reply.innerText = "Reply";

    reply.addEventListener("click", (e) => {
      if (incrementComment == 1) {
        replyOnAcomment(e);
        let input =
          e.target.parentElement.parentElement.nextSibling.querySelector(
            "textarea"
          );
        input.focus();
        input.value =
          "@" + e.target.parentElement.querySelector(".username").innerText;
        incrementComment = 2;
      }
    });

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerText = "Delete";

    function findIndexById(id) {
      return outerArray.findIndex((element) => element.id === id);
    }

    // Delete element by ID
    function deleteElementById(id) {
      const index = findIndexById(id);
      if (index !== -1) {
        outerArray.splice(index, 1);
      }
    }
    deleteButton.addEventListener("click", (e) => {
      deleteElementById(item.id);
      localStorage.setItem("comments", JSON.stringify(outerArray));
      commentThreadRenderer.remove();
    });

    let repliesArray = item.replies;

    scoreContainer.appendChild(scoreIncrement);
    scoreContainer.appendChild(scoreElement);
    scoreContainer.appendChild(scoreDecrement);

    userContainer.appendChild(userImage);
    userContainer.appendChild(userName);

    comment.appendChild(userContainer);
    if (item.you) {
      comment.appendChild(deleteButton);
      youUser.innerText = item.you;
      userContainer.appendChild(youUser);
      comment.appendChild(editButton);
    } else {
      comment.appendChild(reply);
    }
    userContainer.appendChild(userCommentDate);

    container.appendChild(scoreContainer);
    container.appendChild(comment);
    container.appendChild(commentText);

    commentThreadRenderer.appendChild(container);

    if (repliesArray.length) {
      let threadLineContainer = document.createElement("div");
      threadLineContainer.classList.add("thread-line-container");

      let threadLine = document.createElement("div");
      threadLine.classList.add("thread-line");
      commentThreadRenderer.appendChild(threadLine);
      for (let i = 0; i < repliesArray.length; i++) {
        let container = document.createElement("div");
        container.classList.add("reply-container");
        container.id = repliesArray[i].id;
        container.setAttribute("data-id", repliesArray[i].containerId);

        let scoreContainer = document.createElement("div");
        scoreContainer.classList.add("score-container");

        let scoreIncrement = document.createElement("div");
        scoreIncrement.classList.add("score-increment");
        scoreIncrement.innerText = "+";

        let scoreElement = document.createElement("div");
        scoreElement.classList.add("score-element");
        scoreElement.innerText = repliesArray[i].score;

        let scoreDecrement = document.createElement("div");
        scoreDecrement.classList.add("score-decrement");
        scoreDecrement.innerText = "-";

        let comment = document.createElement("div");
        comment.classList.add("comment");

        let replyingTo = document.createElement("span");
        replyingTo.classList.add("replying-to");
        replyingTo.innerText = "@" + repliesArray[i].replyingTo;

        let commentText = document.createElement("div");
        commentText.classList.add("comment-text");

        let commentTitle = document.createElement("span");
        commentTitle.innerText = " " + repliesArray[i].title;

        commentText.appendChild(replyingTo);
        commentText.appendChild(commentTitle);

        let editContainer = document.createElement("div");
        editContainer.classList.add("edit-container");

        let buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("buttons-container");

        let cancel = document.createElement("button");
        cancel.classList.add("cancel");
        cancel.innerText = "cancel";

        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerText = "Edit";

        let updateButton = document.createElement("button");
        updateButton.classList.add("update-button");
        updateButton.innerText = "Update";
        buttonsContainer.appendChild(cancel);
        buttonsContainer.appendChild(updateButton);

        let newInput = document.createElement("textarea");
        editButton.onclick = (e) => {
          let commentsArray =
            JSON.parse(localStorage.getItem("comments")) || [];
          newInput.placeholder = "Add a comment";
          newInput.value = commentText.innerText.replace(
            replyingTo.innerText,
            ""
          );

          editContainer.appendChild(newInput);
          editContainer.appendChild(buttonsContainer);
          container.appendChild(editContainer);
          newInput.focus();

          cancel.onclick = (e) => {
            editContainer.remove();
            container.appendChild(commentText);
          };

          updateButton.onclick = (e) => {
            if (newInput.value.trim() !== repliesArray[i].title) {
              commentsArray[item.id].replies[i].title = newInput.value;
              commentText.innerText = commentsArray[item.id].replies[i].title;
              commentText.prepend(replyingTo);

              localStorage.setItem("comments", JSON.stringify(commentsArray));
              cancel.click();
            }
          };
          commentText.remove();
          replyingTo.remove();
        };

        let reply = document.createElement("i");
        reply.classList.add("reply");
        reply.innerText = "Reply";

        reply.addEventListener("click", (e) => {
          if (incrementReply <= 1) {
            replyOnAcomment(e);
            let input =
              e.target.parentElement.parentElement.nextSibling.querySelector(
                "textarea"
              );
            input.focus();
            input.value =
              "@" + e.target.parentElement.querySelector(".username").innerText;
            incrementReply = 2;
          }
        });

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = (e) => {
          let commentsArray =
            JSON.parse(localStorage.getItem("comments")) || [];

          commentsArray[item.id].replies = commentsArray[
            item.id
          ].replies.filter((reply) => parseInt(container.id) !== reply.id);
          localStorage.setItem("comments", JSON.stringify(commentsArray));

          container.remove();
        };
        scoreIncrement.onclick = (e) => {
          let commentsArray =
            JSON.parse(localStorage.getItem("comments")) || [];
          if (incrementReply <= 1) {
            commentsArray[id].replies[i].score =
              commentsArray[id].replies[i].score + incrementReply;
            scoreElement.innerText = commentsArray[id].replies[i].score;
            localStorage.setItem("comments", JSON.stringify(commentsArray));
            incrementReply = 2;
          }
        };
        scoreIncrement.onclick = () => {
          let commentsArray =
            JSON.parse(localStorage.getItem("comments")) || [];
          if (!commentsArray[id].replies[i].updated) {
            commentsArray[id].replies[i].score =
              commentsArray[id].replies[i].score + 1;
            scoreElement.innerText = commentsArray[id].replies[i].score;
            commentsArray[id].replies[i].updated = true; // Set the flag to indicate that the score has been updated
          }

          localStorage.setItem("comments", JSON.stringify(commentsArray));
        };
        scoreDecrement.onclick = () => {
          let commentsArray =
            JSON.parse(localStorage.getItem("comments")) || [];
          if (commentsArray[id].replies[i].updated) {
            commentsArray[id].replies[i].score =
              commentsArray[id].replies[i].score - 1;
            scoreElement.innerText = commentsArray[id].replies[i].score;
            commentsArray[id].replies[i].updated = false; // Set the flag to indicate that the score has been updated
          }
          localStorage.setItem("comments", JSON.stringify(commentsArray));
        };
        let userContainer = document.createElement("div");
        userContainer.classList.add("user-container");

        let youUser = document.createElement("div");
        youUser.classList.add("you");

        let userImage = document.createElement("img");
        userImage.classList.add("user-image");

        let userName = document.createElement("div");
        userName.classList.add("username");

        if (repliesArray[i].image && repliesArray[i].username) {
          userImage.src = repliesArray[i].image;
          userName.innerText = repliesArray[i].username;
        } else {
          userImage.src = item.replies[i].user.image.png;
          userName.innerText = item.replies[i].user.username;
        }
        let userCommentDate = document.createElement("div");
        userCommentDate.classList.add("comment-date");
        userCommentDate.innerText = repliesArray[i].createdAt;

        scoreContainer.appendChild(scoreIncrement);
        scoreContainer.appendChild(scoreElement);
        scoreContainer.appendChild(scoreDecrement);
        comment.appendChild(userContainer);

        userContainer.appendChild(userImage);
        userContainer.appendChild(userName);

        if (repliesArray[i].you) {
          userContainer.appendChild(youUser);
          comment.appendChild(deleteButton);
          youUser.innerText = repliesArray[i].you;
          comment.appendChild(editButton);
        } else {
          comment.appendChild(reply);
        }
        userContainer.appendChild(userCommentDate);
        container.appendChild(scoreContainer);
        container.appendChild(comment);
        container.appendChild(commentText);

        commentThreadRenderer.append(container);
        repliesArray[i].index = comments[id].replies.length;
      }
    }
    allContainer.appendChild(commentThreadRenderer);
  });
}

function addComment() {
  const newComment = input.value.trim();
  let comment = {
    title: newComment,
    createdAt: "1 second ago",
    score: 0,
    replies: [],
    updated: false,
    you: "you",
  };
  fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      comment.username = data.currentUser.username;
      comment.image = data.currentUser.image.png;
      if (newComment !== "") {
        let commentsArray = JSON.parse(localStorage.getItem("comments")) || [];
        comment.id = commentsArray.length;

        commentsArray.push(comment);
        localStorage.setItem("comments", JSON.stringify(commentsArray));
        displayComments(commentsArray);

        input.value = "";
      }
    });
}

function replyOnAcomment(e) {
  let sendSection = document.createElement("div");
  sendSection.classList.add("reply-section");

  let userImage = document.createElement("img");
  fetcheUserImage(userImage);

  let inputField = document.createElement("div");
  inputField.classList.add("reply-field");
  inputField.name = "form";

  let buttonsContainer = document.createElement("div");
  buttonsContainer.classList.add("buttons-container");

  let input = document.createElement("textarea");
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
  sendSection.appendChild(userImage);
  sendSection.appendChild(inputField);
  e.target.parentElement.parentElement.after(sendSection);
  sendButton.onclick = (e) => {
    input.value.trim();
    if (
      input.value.trim() !== "" &&
      input.value.trim() !==
        "@" +
          e.target.parentElement.parentElement.parentElement.previousSibling.querySelector(
            ".username"
          ).innerText
    ) {
      let commentsArray = JSON.parse(localStorage.getItem("comments")) || [];

      let parentElementId =
        e.target.parentElement.parentElement.parentElement.parentElement.id;

      let item = {
        title: input.value
          .replace(
            e.target.parentElement.parentElement.parentElement.previousSibling.querySelector(
              ".username"
            ).innerText,
            ""
          )
          .replace("@", ""),
        createdAt: "1 second ago",
        score: 0,
        replyingTo:
          e.target.parentElement.parentElement.parentElement.previousSibling.querySelector(
            ".username"
          ).innerText,
        image: "./images/avatars/image-juliusomo.png",
        username: "juliusomo",
        containerId: "",
        id: commentsArray[parentElementId].replies.length,
        updated: false,
        you: "you",
      };

      if (input.value != "") {
        let container = document.createElement("div");
        container.classList.add("reply-container");
        container.id = item.id;
        container.setAttribute("data-id", Math.random());
        item.containerId = container.getAttribute("data-id");

        let scoreContainer = document.createElement("div");
        scoreContainer.classList.add("score-container");

        let scoreElement = document.createElement("div");
        scoreElement.classList.add("score-element");
        scoreElement.innerText = item.score;

        let scoreIncrement = document.createElement("div");
        scoreIncrement.classList.add("score-increment");
        scoreIncrement.innerText = "+";
        incrementComment = 1;
        incrementReply = 1;

        scoreIncrement.onclick = () => {
          let commentsArray =
            JSON.parse(localStorage.getItem("comments")) || [];
          if (!item.updated) {
            item.score = item.score + 1;
            scoreElement.innerText = item.score;
            item.updated = true; // Set the flag to indicate that the score has been updated
          }
          localStorage.setItem("comments", JSON.stringify(commentsArray));
        };

        let scoreDecrement = document.createElement("div");
        scoreDecrement.classList.add("score-decrement");
        scoreDecrement.innerText = "-";

        scoreDecrement.onclick = () => {
          let commentsArray =
            JSON.parse(localStorage.getItem("comments")) || [];
          if (item.updated) {
            item.score = item.score - 1;
            scoreElement.innerText = item.score;
            item.updated = false; // Set the flag to indicate that the score has been updated
          }
          localStorage.setItem("comments", JSON.stringify(commentsArray));
        };

        let comment = document.createElement("div");
        comment.classList.add("comment");

        let replyingTo = document.createElement("span");
        replyingTo.classList.add("replying-to");
        replyingTo.innerText = "@" + item.replyingTo;

        let commentText = document.createElement("div");
        commentText.classList.add("comment-text");
        let commentTitle = document.createElement("span");
        commentTitle.innerText = " " + item.title;

        commentText.appendChild(replyingTo);
        commentText.appendChild(commentTitle);
        let editContainer = document.createElement("div");
        editContainer.classList.add("edit-container");

        let editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.innerText = "Edit";

        let buttonsContainer = document.createElement("div");
        buttonsContainer.classList.add("buttons-container");

        let updateButton = document.createElement("button");
        updateButton.classList.add("update-button");
        updateButton.innerText = "Update";

        buttonsContainer.appendChild(cancel);
        buttonsContainer.appendChild(updateButton);

        let input = document.createElement("textarea");
        input.placeholder = "Add a comment";

        editButton.onclick = (e) => {
          input.value = commentText.innerText;
          editContainer.appendChild(input);
          editContainer.appendChild(buttonsContainer);
          container.appendChild(editContainer);
          input.focus();

          cancel.onclick = (e) => {
            editContainer.remove();
            container.appendChild(replyingTo);
            container.appendChild(commentText);
          };

          updateButton.onclick = (e) => {
            if (input.value.trim() !== item.title) {
              item.title = input.value;
              commentText.innerText = item.title;
              localStorage.setItem("comments", JSON.stringify(commentsArray));
              cancel.click();
            }
          };
          commentText.remove();
          replyingTo.remove();
        };

        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerText = "Delete";

        deleteButton.addEventListener("click", (e) => {
          let commentsArray =
            JSON.parse(localStorage.getItem("comments")) || [];
          commentsArray[parentElementId].replies = commentsArray[
            parentElementId
          ].replies.filter((reply) => item.id !== reply.id);
          localStorage.setItem("comments", JSON.stringify(commentsArray));
          container.remove();
        });

        let userContainer = document.createElement("div");
        userContainer.classList.add("user-container");

        let youUser = document.createElement("div");
        youUser.classList.add("you");
        youUser.innerText = item.you;

        let userImage = document.createElement("img");
        userImage.classList.add("user-image");
        userImage.src = item.image;

        let userName = document.createElement("div");
        userName.classList.add("username");
        userName.innerText = item.username;

        let userCommentDate = document.createElement("div");
        userCommentDate.classList.add("comment-date");
        userCommentDate.innerText = item.createdAt;

        scoreContainer.appendChild(scoreIncrement);
        scoreContainer.appendChild(scoreElement);
        scoreContainer.appendChild(scoreDecrement);

        userContainer.appendChild(userImage);
        userContainer.appendChild(userName);
        userContainer.appendChild(youUser);
        userContainer.appendChild(userCommentDate);

        comment.appendChild(userContainer);
        comment.appendChild(deleteButton);
        comment.appendChild(editButton);

        container.appendChild(scoreContainer);
        container.appendChild(comment);
        container.appendChild(commentText);

        e.target.parentElement.parentElement.parentElement.parentElement.append(
          container
        );

        commentsArray[parentElementId].replies.push(item);
        localStorage.setItem("comments", JSON.stringify(commentsArray));
        sendSection.remove();
      }
    }
  };

  cancel.onclick = () => {
    sendSection.remove();
    incrementComment = 1;
    incrementReply = 1;
  };
}

sendButton.onclick = (e) => {
  addComment();
};

let initialCommentsArray =
  JSON.parse(localStorage.getItem("comments")) || fetched();
displayComments(initialCommentsArray);
