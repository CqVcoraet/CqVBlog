"use strict"

class Theme {
    constructor(backgroundColor, navBackgroundColor, topBarBg, topBarBg2, textColor, accentColor, createBtnColor, signInBtnColor, bgOverlayColor, postContainerBg, postContentBg, postMetaBg, postAccentText) {
        this.backgroundColor = backgroundColor;
        this.navBackgroundColor = navBackgroundColor;
        this.topBarBg = topBarBg;
        this.topBarBg2 = topBarBg2;
        this.textColor = textColor;
        this.accentColor = accentColor;
        this.createBtnColor = createBtnColor;
        this.signInBtnColor = signInBtnColor;
        this.bgOverlayColor = bgOverlayColor;
        this.postContainerBg = postContainerBg;
        this.postContentBg = postContentBg;
        this.postMetaBg = postMetaBg;
        this.postAccentText = postAccentText;
    }
}

// Themes
const darkBlueTheme = new Theme("#01080f", "#033d70", "#021f38", "#010f1b", "#FFFFFF", "#05B9FA", "#05DBFC", "#FFC900", "#03213b", "#10406a", "#021f38", "#042745", "#05DBFC"); // Default
const greenTheme = new Theme("#000f00", "#004400", "#001f00", "#000a00", "#FFFFFF", "#00D977", "#00FF88", "#00CC66", "#001a00", "#004d1a", "#001a06", "#003311", "#00FF88");
const redTheme = new Theme("#0f0000", "#440000", "#1f0000", "#0a0000", "#FFFFFF", "#FF3333", "#FF5555", "#FF0000", "#260101", "#6b0000", "#1a0000", "#330000", "#FF5555");
const lightTheme = new Theme("#F5F5F5", "#cecccc", "#FFFFFF", "#F0F0F0", "#000000", "#007ACC", "#0078D4", "#005A9E", "#E8E8E8", "#E8F4FF", "#F5FAFB", "#D4E8F7", "#0078D4");
const darkTheme = new Theme("#000000", "#222222", "#0a0a0a", "#050505", "#FFFFFF", "#05B9FA", "#05B9FA", "#05B9FA", "#0f0f0f", "#1a1a1a", "#050505", "#0f0f0f", "#05B9FA");

// Store current theme
let currentTheme = darkBlueTheme;

// Function to apply theme to CSS variables
function applyTheme(theme) {
    currentTheme = theme;
    const root = document.documentElement;
    root.style.setProperty('--background-color', theme.backgroundColor);
    root.style.setProperty('--nav-background-color', theme.navBackgroundColor);
    root.style.setProperty('--top-bar-bg', theme.topBarBg);
    root.style.setProperty('--top-bar-bg2', theme.topBarBg2);
    root.style.setProperty('--text-color', theme.textColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--create-btn-color', theme.createBtnColor);
    root.style.setProperty('--sign-in-btn-color', theme.signInBtnColor);
    root.style.setProperty('--bg-overlay', theme.bgOverlayColor);
    root.style.setProperty('--post-container-bg', theme.postContainerBg);
    root.style.setProperty('--post-content-bg', theme.postContentBg);
    root.style.setProperty('--post-meta-bg', theme.postMetaBg);
    root.style.setProperty('--post-accent-text', theme.postAccentText);
    
    // Save theme preference to localStorage
    localStorage.setItem('selectedTheme', JSON.stringify({
        backgroundColor: theme.backgroundColor,
        navBackgroundColor: theme.navBackgroundColor,
        topBarBg: theme.topBarBg,
        topBarBg2: theme.topBarBg2,
        textColor: theme.textColor,
        accentColor: theme.accentColor,
        createBtnColor: theme.createBtnColor,
        signInBtnColor: theme.signInBtnColor,
        bgOverlayColor: theme.bgOverlayColor,
        postContainerBg: theme.postContainerBg,
        postContentBg: theme.postContentBg,
        postMetaBg: theme.postMetaBg,
        postAccentText: theme.postAccentText
    }));
}

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
            themeData.postAccentText
        );
        applyTheme(loadedTheme);
    }
}

// Initialize theme on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSavedTheme);
} else {
    loadSavedTheme();
}

// Expose themes and applyTheme to global scope for use in settings.js
window.darkBlueTheme = darkBlueTheme;
window.greenTheme = greenTheme;
window.redTheme = redTheme;
window.lightTheme = lightTheme;
window.darkTheme = darkTheme;
window.applyTheme = applyTheme;

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