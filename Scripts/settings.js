"use strict"

const aboutThisSite = document.querySelector(".about-option");

function formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
}

// Helper function to get CSS variable values
function getCSSVariable(varName) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function openAboutView() {
    const backgroundColor = getCSSVariable('--background-color');
    const accentColor = getCSSVariable('--accent-color');
    const postAccentText = getCSSVariable('--post-accent-text');
    const postContainerBg = getCSSVariable('--post-container-bg');
    const postContentBg = getCSSVariable('--post-content-bg');
    const postMetaBg = getCSSVariable('--post-meta-bg');
    const textColor = getCSSVariable('--text-color');

    // Create a container for the expanded view overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(1, 8, 15, 0.95)";
    overlay.style.zIndex = "1000";
    overlay.style.overflowY = "auto";
    overlay.style.padding = "24px";
    overlay.style.boxSizing = "border-box";

    // Create back button
    const backButton = document.createElement("button");
    backButton.textContent = "← Back to Settings";
    backButton.style.display = "inline-flex";
    backButton.style.alignItems = "center";
    backButton.style.gap = "8px";
    backButton.style.backgroundColor = accentColor;
    backButton.style.color = backgroundColor;
    backButton.style.padding = "12px 20px";
    backButton.style.borderRadius = "50rem";
    backButton.style.border = "none";
    backButton.style.cursor = "pointer";
    backButton.style.fontWeight = "bold";
    backButton.style.marginBottom = "24px";
    backButton.style.fontSize = "16px";
    backButton.style.transition = "transform 0.25s ease, background-color 0.25s ease";
    
    backButton.addEventListener("mouseenter", function() {
        backButton.style.backgroundColor = postAccentText;
        backButton.style.transform = "scale(1.05)";
    });
    
    backButton.addEventListener("mouseleave", function() {
        backButton.style.backgroundColor = accentColor;
        backButton.style.transform = "scale(1)";
    });
    
    backButton.addEventListener("click", function() {
        overlay.remove();
    });

    overlay.appendChild(backButton);

    // Create expanded post container
    const expandedPost = document.createElement("div");
    expandedPost.style.maxWidth = "1200px";
    expandedPost.style.margin = "0 auto";
    expandedPost.style.padding = "32px";
    expandedPost.style.backgroundColor = postContainerBg;
    expandedPost.style.fontFamily = "'Inter', sans-serif";
    expandedPost.style.borderRadius = "3rem";
    expandedPost.style.boxShadow = "0 8px 32px rgba(5, 185, 250, 0.2)";

    // Post title
    const postTitle = document.createElement("div");
    postTitle.textContent = "About This Site";
    postTitle.style.backgroundColor = accentColor;
    postTitle.style.color = backgroundColor;
    postTitle.style.padding = "24px";
    postTitle.style.marginBottom = "20px";
    postTitle.style.borderRadius = "3rem";
    postTitle.style.fontSize = "42px";
    postTitle.style.fontWeight = "bold";
    expandedPost.appendChild(postTitle);

    // Post date
    const postDate = document.createElement("div");
    postDate.textContent = "Published: " + formatDate("08/18/2026");
    postDate.style.backgroundColor = postMetaBg;
    postDate.style.color = postAccentText;
    postDate.style.padding = "30px 20px";
    postDate.style.marginBottom = "16px";
    postDate.style.borderRadius = "3rem";
    postDate.style.fontSize = "16px";
    postDate.style.fontWeight = "600";
    expandedPost.appendChild(postDate);

    // Post meta (category and topic)
    const postMeta = document.createElement("div");
    postMeta.style.backgroundColor = postMetaBg;
    postMeta.style.color = textColor;
    postMeta.style.padding = "30px 20px";
    postMeta.style.marginBottom = "24px";
    postMeta.style.borderRadius = "3rem";
    postMeta.style.display = "flex";
    postMeta.style.gap = "32px";
    postMeta.style.flexWrap = "wrap";
    postMeta.style.fontSize = "16px";
    postMeta.style.fontWeight = "500";

    const categorySpan = document.createElement("span");
    categorySpan.innerHTML = `<strong style='color: ${postAccentText};'>Category:</strong> Information`;
    postMeta.appendChild(categorySpan);

    const topicSpan = document.createElement("span");
    topicSpan.innerHTML = `<strong style='color: ${postAccentText};'>Topic:</strong> This Website`;
    postMeta.appendChild(topicSpan);

    expandedPost.appendChild(postMeta);

    // Post content
    const postContent = document.createElement("div");
    postContent.textContent = "This is my official portfolio website where I showcase my current projects and have my very own blog with posts I add whenever I can.";
    postContent.style.backgroundColor = postContentBg;
    postContent.style.color = textColor;
    postContent.style.padding = "28px";
    postContent.style.borderRadius = "3rem";
    postContent.style.lineHeight = "1.8";
    postContent.style.fontSize = "18px";
    postContent.style.whiteSpace = "pre-wrap";
    postContent.style.wordWrap = "break-word";
    expandedPost.appendChild(postContent);

    overlay.appendChild(expandedPost);
    document.body.appendChild(overlay);
}

aboutThisSite.addEventListener("click", openAboutView);

const changeThemeOption = document.querySelector(".change-theme-option");

function openThemePicker() {
    const backgroundColor = getCSSVariable('--background-color');
    const accentColor = getCSSVariable('--accent-color');
    const postAccentText = getCSSVariable('--post-accent-text');
    const textColor = getCSSVariable('--text-color');
    const navBackgroundColor = getCSSVariable('--nav-background-color');

    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(1, 8, 15, 0.95)";
    overlay.style.zIndex = "1000";
    overlay.style.overflowY = "auto";
    overlay.style.padding = "24px";
    overlay.style.boxSizing = "border-box";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    // Back button
    const backButton = document.createElement("button");
    backButton.textContent = "← Back to Settings";
    backButton.style.position = "absolute";
    backButton.style.top = "24px";
    backButton.style.left = "24px";
    backButton.style.display = "inline-flex";
    backButton.style.alignItems = "center";
    backButton.style.gap = "8px";
    backButton.style.backgroundColor = accentColor;
    backButton.style.color = backgroundColor;
    backButton.style.padding = "12px 20px";
    backButton.style.borderRadius = "50rem";
    backButton.style.border = "none";
    backButton.style.cursor = "pointer";
    backButton.style.fontWeight = "bold";
    backButton.style.fontSize = "16px";
    backButton.style.transition = "transform 0.25s ease, background-color 0.25s ease";
    
    backButton.addEventListener("mouseenter", function() {
        backButton.style.backgroundColor = postAccentText;
        backButton.style.transform = "scale(1.05)";
    });
    
    backButton.addEventListener("mouseleave", function() {
        backButton.style.backgroundColor = accentColor;
        backButton.style.transform = "scale(1)";
    });
    
    backButton.addEventListener("click", function() {
        overlay.remove();
    });

    overlay.appendChild(backButton);

    // Theme container
    const themeContainer = document.createElement("div");
    themeContainer.style.display = "grid";
    themeContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
    themeContainer.style.gap = "24px";
    themeContainer.style.maxWidth = "900px";
    themeContainer.style.width = "100%";

    // Theme data
    const themes = [
        { name: "Blue", bg: "#01080f", accent: "#05B9FA", themeName: "darkBlueTheme" },
        { name: "Green", bg: "#000f00", accent: "#00D977", themeName: "greenTheme" },
        { name: "Red", bg: "#0f0000", accent: "#FF3333", themeName: "redTheme" },
        { name: "Light", bg: "#F5F5F5", accent: "#007ACC", themeName: "lightTheme" },
        { name: "Dark", bg: "#000000", accent: "#666666", themeName: "darkTheme" }
    ];

    // Create theme buttons
    themes.forEach(theme => {
        const themeButton = document.createElement("button");
        themeButton.style.padding = "32px";
        themeButton.style.borderRadius = "2rem";
        themeButton.style.border = `2px solid ${accentColor}`;
        themeButton.style.cursor = "pointer";
        themeButton.style.transition = "transform 0.25s ease, box-shadow 0.25s ease";
        themeButton.style.display = "flex";
        themeButton.style.flexDirection = "column";
        themeButton.style.alignItems = "center";
        themeButton.style.gap = "16px";
        themeButton.style.backgroundColor = navBackgroundColor;

        // Color preview
        const colorPreview = document.createElement("div");
        colorPreview.style.width = "80px";
        colorPreview.style.height = "80px";
        colorPreview.style.backgroundColor = theme.bg;
        colorPreview.style.borderRadius = "1rem";
        colorPreview.style.border = `3px solid ${theme.accent}`;
        themeButton.appendChild(colorPreview);

        // Theme name
        const themeName = document.createElement("div");
        themeName.textContent = theme.name;
        themeName.style.color = textColor;
        themeName.style.fontSize = "18px";
        themeName.style.fontWeight = "bold";
        themeButton.appendChild(themeName);

        themeButton.addEventListener("mouseenter", function() {
            themeButton.style.transform = "scale(1.05)";
            themeButton.style.boxShadow = `0 0 20px ${theme.accent}`;
        });

        themeButton.addEventListener("mouseleave", function() {
            themeButton.style.transform = "scale(1)";
            themeButton.style.boxShadow = "none";
        });

        themeButton.addEventListener("click", function() {
            // Apply theme - get the theme object from window
            const themeMap = {
                darkBlueTheme: window.darkBlueTheme,
                greenTheme: window.greenTheme,
                redTheme: window.redTheme,
                lightTheme: window.lightTheme,
                darkTheme: window.darkTheme
            };
            
            if (themeMap[theme.themeName] && window.applyTheme) {
                window.applyTheme(themeMap[theme.themeName]);
                overlay.remove();
            }
        });

        themeContainer.appendChild(themeButton);
    });

    overlay.appendChild(themeContainer);
    document.body.appendChild(overlay);
}

changeThemeOption.addEventListener("click", openThemePicker);

const changeFontOption = document.querySelector(".change-font-option");

function openFontSelector() {
    const backgroundColor = getCSSVariable('--background-color');
    const accentColor = getCSSVariable('--accent-color');
    const postAccentText = getCSSVariable('--post-accent-text');
    const textColor = getCSSVariable('--text-color');
    const navBackgroundColor = getCSSVariable('--nav-background-color');

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(1, 8, 15, 0.95)";
    overlay.style.zIndex = "1000";
    overlay.style.overflowY = "auto";
    overlay.style.padding = "24px";
    overlay.style.boxSizing = "border-box";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";

    const backButton = document.createElement("button");
    backButton.textContent = "← Back to Settings";
    backButton.style.position = "absolute";
    backButton.style.top = "24px";
    backButton.style.left = "24px";
    backButton.style.display = "inline-flex";
    backButton.style.alignItems = "center";
    backButton.style.gap = "8px";
    backButton.style.backgroundColor = accentColor;
    backButton.style.color = backgroundColor;
    backButton.style.padding = "12px 20px";
    backButton.style.borderRadius = "50rem";
    backButton.style.border = "none";
    backButton.style.cursor = "pointer";
    backButton.style.fontWeight = "bold";
    backButton.style.fontSize = "16px";
    backButton.style.transition = "transform 0.25s ease, background-color 0.25s ease";

    backButton.addEventListener("mouseenter", function() {
        backButton.style.backgroundColor = postAccentText;
        backButton.style.transform = "scale(1.05)";
    });

    backButton.addEventListener("mouseleave", function() {
        backButton.style.backgroundColor = accentColor;
        backButton.style.transform = "scale(1)";
    });

    backButton.addEventListener("click", function() {
        overlay.remove();
    });

    overlay.appendChild(backButton);

    const fontContainer = document.createElement("div");
    fontContainer.style.display = "grid";
    fontContainer.style.gridTemplateColumns = "repeat(auto-fit, minmax(200px, 1fr))";
    fontContainer.style.gap = "24px";
    fontContainer.style.maxWidth = "900px";
    fontContainer.style.width = "100%";

    const fonts = [
        { name: "Inter", font: window.inter },
        { name: "Lexend", font: window.lexend },
        { name: "Aldrich", font: window.aldrich },
        { name: "Google Sans Flex", font: window.googleSansFlex },
        { name: "System", font: window.systemFont }
    ];

    fonts.forEach(({ name, font }) => {
        if (!font) {
            return;
        }

        if (font.fontLink && !document.querySelector(`link[data-font-preview="${name}"]`)) {
            const fontLink = document.createElement("link");
            fontLink.rel = "stylesheet";
            fontLink.href = font.fontLink;
            fontLink.dataset.fontPreview = name;
            document.head.appendChild(fontLink);
        }

        const fontButton = document.createElement("button");
        fontButton.type = "button";
        fontButton.style.padding = "32px 24px";
        fontButton.style.borderRadius = "2rem";
        fontButton.style.border = `2px solid ${accentColor}`;
        fontButton.style.cursor = "pointer";
        fontButton.style.transition = "transform 0.25s ease, box-shadow 0.25s ease";
        fontButton.style.display = "flex";
        fontButton.style.flexDirection = "column";
        fontButton.style.alignItems = "center";
        fontButton.style.gap = "16px";
        fontButton.style.backgroundColor = navBackgroundColor;

        const fontPreview = document.createElement("div");
        fontPreview.textContent = font.fontName;
        fontPreview.style.fontFamily = font.fontName.toLowerCase() === "system"
            ? "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif"
            : `"${font.fontName}"`;
        fontPreview.style.color = textColor;
        fontPreview.style.fontSize = "24px";
        fontPreview.style.fontWeight = "600";
        fontPreview.style.textAlign = "center";
        fontButton.appendChild(fontPreview);

        fontButton.addEventListener("mouseenter", function() {
            fontButton.style.transform = "scale(1.05)";
            fontButton.style.boxShadow = `0 0 20px ${accentColor}`;
        });

        fontButton.addEventListener("mouseleave", function() {
            fontButton.style.transform = "scale(1)";
            fontButton.style.boxShadow = "none";
        });

        fontButton.addEventListener("click", function() {
            if (!window.applyFont) {
                return;
            }

            window.applyFont(font)
                .then(() => overlay.remove())
                .catch((error) => console.error("Failed to apply font:", error));
        });

        fontContainer.appendChild(fontButton);
    });

    overlay.appendChild(fontContainer);
    document.body.appendChild(overlay);
}

changeFontOption.addEventListener("click", openFontSelector);