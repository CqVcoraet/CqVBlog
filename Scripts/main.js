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
const aldrich = new Font("Aldrich", "https://fonts.googleapis.com/css2?family=Aldrich&display=swap");
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
window.aldrich = aldrich;
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
        signInOverlay();
    });
}

function getThemeVariable(variableName, fallback) {
    return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim() || fallback;
}

function signInOverlay() {
    console.log("Sign in overlay rendering");

    const createPostBg = getThemeVariable("--create-post-bg", "#03468F");
    const textColor = getThemeVariable("--text-color", "#FFFFFF");
    const accentColor = getThemeVariable("--accent-color", "#05B9FA");
    const backgroundColor = getThemeVariable("--background-color", "#01080f");
    const postContentBg = getThemeVariable("--post-content-bg", "#021f38");

    let overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.5)",
        zIndex: "9999",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        boxSizing: "border-box"
    });

    let viewBox = document.createElement("div");
    Object.assign(viewBox.style, {
        background: createPostBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        padding: "32px 36px",
        borderRadius: "2rem",
        fontFamily: "inherit",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
        color: textColor,
        width: "100%",
        maxWidth: "460px",
        boxSizing: "border-box"
    });

    const title = document.createElement("h2");
    title.textContent = "Sign In";
    Object.assign(title.style, {
        margin: "0 0 8px",
        fontSize: "28px",
        textAlign: "center"
    });

    const subtitle = document.createElement("p");
    subtitle.textContent = "Sign in to manage your posts.";
    Object.assign(subtitle.style, {
        margin: "0 0 24px",
        color: textColor,
        opacity: "0.8",
        textAlign: "center",
        fontSize: "15px"
    });

    const form = document.createElement("form");
    Object.assign(form.style, {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    });

    const createField = (labelText, type, placeholder) => {
        const label = document.createElement("label");
        Object.assign(label.style, {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            fontSize: "15px",
            fontWeight: "600"
        });

        const labelTextElement = document.createElement("span");
        labelTextElement.textContent = labelText;

        const input = document.createElement("input");
        input.type = type;
        input.placeholder = placeholder;
        input.required = true;
        Object.assign(input.style, {
            padding: "12px 14px",
            borderRadius: "2rem",
            border: `1px solid ${accentColor}`,
            background: postContentBg,
            color: textColor,
            font: "inherit",
            outline: "none",
            boxSizing: "border-box"
        });

        label.append(labelTextElement, input);
        return { label, input };
    };

    const emailField = createField("Email", "email", "Enter your email");
    const passwordField = createField("Password", "password", "Enter your password");

    const passwordToggle = document.createElement("button");
    passwordToggle.type = "button";
    passwordToggle.textContent = "Show password";
    Object.assign(passwordToggle.style, {
        alignSelf: "flex-end",
        marginTop: "-6px",
        padding: "0",
        border: "none",
        background: "transparent",
        color: textColor,
        cursor: "pointer",
        font: "inherit",
        fontSize: "13px"
    });

    passwordToggle.addEventListener("click", () => {
        const isPassword = passwordField.input.type === "password";
        passwordField.input.type = isPassword ? "text" : "password";
        passwordToggle.textContent = isPassword ? "Hide password" : "Show password";
    });

    const buttonRow = document.createElement("div");
    Object.assign(buttonRow.style, {
        display: "flex",
        gap: "12px",
        marginTop: "8px"
    });

    const cancelButton = document.createElement("button");
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";
    Object.assign(cancelButton.style, {
        flex: "1",
        padding: "12px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        background: "transparent",
        color: textColor,
        border: `1px solid ${textColor}`,
        borderRadius: "50rem",
        cursor: "pointer"
    });

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Sign In";
    Object.assign(submitButton.style, {
        flex: "1",
        padding: "12px 20px",
        fontSize: "16px",
        fontWeight: "bold",
        background: accentColor,
        color: backgroundColor,
        border: "none",
        borderRadius: "50rem",
        cursor: "pointer"
    });

    [cancelButton, submitButton].forEach((button) => {
        button.style.transition = "transform 0.2s ease";
        button.addEventListener("mouseenter", () => {
            button.style.transform = "scale(1.05)";
        });
        button.addEventListener("mouseleave", () => {
            button.style.transform = "scale(1)";
        });
    });

    const closeOverlay = () => {
        if (document.body.contains(overlay)) {
            overlay.remove();
        }
    };

    cancelButton.addEventListener("click", closeOverlay);
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeOverlay();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        warnAlert("Sign in is not connected yet. Your credentials were not submitted.");
    });

    buttonRow.append(cancelButton, submitButton);
    form.append(emailField.label, passwordField.label, passwordToggle, buttonRow);
    viewBox.append(title, subtitle, form);
    overlay.appendChild(viewBox);
    document.body.appendChild(overlay);
}