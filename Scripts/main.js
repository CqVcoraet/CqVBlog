"use strict"

const notAvailableYet = new CustomAlert("This feature is not available yet.", "#FFC900", "#000000", "#000000", "#FFC900", {
    label: "OK",
    callback: () => {}
});

const createPostView = new CreatePostView("Null", "Null", Category.OTHER, "Null");

const initializeCreatePostButton = () => {
    const createPostButton = document.querySelector(".create-post") || document.querySelector(".create-bar");

    if (createPostButton) {
        createPostButton.addEventListener("click", (event) => {
            event.stopPropagation();
            createPostView.renderView();
        });
    }
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCreatePostButton);
} else {
    initializeCreatePostButton();
}