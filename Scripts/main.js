"use strict"

import { Theme, applyTheme } from "./Theme.js";
import { Font, SYSTEM_FONT_NAME, applyFont } from "./Font.js";

// Themes
const darkBlueTheme = new Theme("#01080f", "#033d70", "#021f38", "#010f1b", "#FFFFFF", "#05B9FA", "#05DBFC", "#FFC900", "#03213b", "#10406a", "#021f38", "#042745", "#05DBFC", "#03468F"); // Default
const greenTheme = new Theme("#000f00", "#004400", "#001f00", "#000a00", "#FFFFFF", "#00D977", "#00FF88", "#00CC66", "#001a00", "#004d1a", "#001a06", "#003311", "#00FF88", "#007722");
const redTheme = new Theme("#0f0000", "#440000", "#1f0000", "#0a0000", "#FFFFFF", "#FF3333", "#FF5555", "#FF0000", "#260101", "#6b0000", "#1a0000", "#330000", "#FF5555", "#D20000");
const lightTheme = new Theme("#F5F5F5", "#cecccc", "#FFFFFF", "#F0F0F0", "#000000", "#007ACC", "#0078D4", "#005A9E", "#E8E8E8", "#E8F4FF", "#F5FAFB", "#D4E8F7", "#0078D4", "#bcbcbc");
const darkTheme = new Theme("#000000", "#222222", "#0a0a0a", "#050505", "#FFFFFF", "#05B9FA", "#05B9FA", "#05B9FA", "#0f0f0f", "#1a1a1a", "#050505", "#0f0f0f", "#05B9FA", "#333333");

// Fonts
const inter = new Font("Inter", "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"); // Default
const lexend = new Font("Lexend", "https://fonts.googleapis.com/css2?family=Lexend:wght@100..900&display=swap");
const googleSansFlex = new Font("Google Sans Flex", "https://fonts.googleapis.com/css2?family=Google+Sans+Flex:opsz,wght@6..144,1..1000&display=swap");
const systemFont = new Font(SYSTEM_FONT_NAME, null);

// Load theme from localStorage on page load
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        const themeData = JSON.parse(savedTheme);
        const loadedTheme = new Theme(
            themeData.backgroundColor,
            themeData.navBackgroundColor,
            themeData.topBarBg,
            themeData.topBarBg2,
            themeData.textColor,
            themeData.accentColor,
            themeData.createBtnColor,
            themeData.signInBtnColor,
            themeData.bgOverlayColor,
            themeData.postContainerBg,
            themeData.postContentBg,
            themeData.postMetaBg,
            themeData.postAccentText,
            themeData.createPostBg || darkBlueTheme.createPostBg
        );
        applyTheme(loadedTheme);
    }
}

function loadSavedFont() {
    const savedFont = localStorage.getItem("selectedFont");
    if (!savedFont) {
        return;
    }

    try {
        const fontData = JSON.parse(savedFont);
        const loadedFont = new Font(fontData.fontName, fontData.fontLink || null);
        applyFont(loadedFont).catch((error) => {
            console.error("Failed to load saved font:", error);
        });
    } catch (error) {
        console.error("Invalid saved font:", error);
        localStorage.removeItem("selectedFont");
    }
}

// Initialize theme on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSavedTheme);
    document.addEventListener("DOMContentLoaded", loadSavedFont);
} else {
    loadSavedTheme();
    loadSavedFont();
}

// Expose themes and applyTheme to global scope for use in settings.js
window.darkBlueTheme = darkBlueTheme;
window.greenTheme = greenTheme;
window.redTheme = redTheme;
window.lightTheme = lightTheme;
window.darkTheme = darkTheme;
window.applyTheme = applyTheme;
window.inter = inter;
window.lexend = lexend;
window.googleSansFlex = googleSansFlex;
window.systemFont = systemFont;
window.applyFont = applyFont;

const notAvailableYet = new CustomAlert("This feature is not available yet.", "#FFC900", "#000000", "#000000", "#FFC900", {
    label: "OK",
    callback: () => {}
});

const signInButton = document.querySelector(".sign-in-btn");

// Custom Alerts
function warnAlert(message) {
    let alert = new CustomAlert(message, "#FFC900", "#000000", "#000000", "#FFC900", 
        {
            label: "OK",
            callback: () => {}
        }
    );
    alert.renderAlert();
}

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

if (signInButton) {
    signInButton.addEventListener("click", function() {
        warnAlert("Sign in is not set up yet. Please try again later.");
    });
}