"use strict"

const notAvailableYet = new CustomAlert("This feature is not available yet.", "#FFC900", "#000000", "#000000", "#FFC900", {
    label: "OK",
    callback: () => {}
});

const initializeCreatePostButton = () => {
    const createPostButton = document.querySelector(".create-post") || document.querySelector(".create-bar");

    if (!createPostButton) {
        console.warn("Create post button not found in DOM");
        return;
    }

    createPostButton.addEventListener("click", async (event) => {
        console.log("Create post clicked");
        event.stopPropagation();

        try {
            await import("./CreatePostView.js");

            const CreatePostView = window.CreatePostView;
            const Category = window.Category;

            if (typeof CreatePostView === "function") {
                const createPostView = new CreatePostView("Null", "Null", (Category && Category.OTHER) || "Other", "Null");
                createPostView.renderView();
            } else {
                console.log("CreatePostView is not available after dynamic import");
                notAvailableYet.renderAlert();
            }
        } catch (err) {
            console.log("Failed to load CreatePostView module:", err);
            notAvailableYet.renderAlert();
        }
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeCreatePostButton);
} else {
    initializeCreatePostButton();
}