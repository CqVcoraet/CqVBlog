const notAvailableYet = new CustomAlert("This feature is not available yet.", "#FFC900", "#000000", "#000000", "#FFC900", {
    label: "OK",
    callback: () => {}
});

const createPostButton = document.querySelector(".create-bar");
if (createPostButton) {
    createPostButton.addEventListener("click", () => {
        notAvailableYet.renderAlert();
    });
}