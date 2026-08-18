"use strict"

const aboutThisSite = document.querySelector(".about-option");

function formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}/${day}/${year}`;
}

function openAboutView() {
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
    backButton.style.backgroundColor = "#05B9FA";
    backButton.style.color = "#01080f";
    backButton.style.padding = "12px 20px";
    backButton.style.borderRadius = "50rem";
    backButton.style.border = "none";
    backButton.style.cursor = "pointer";
    backButton.style.fontWeight = "bold";
    backButton.style.marginBottom = "24px";
    backButton.style.fontSize = "16px";
    backButton.style.transition = "transform 0.25s ease, background-color 0.25s ease";
    
    backButton.addEventListener("mouseenter", function() {
        backButton.style.backgroundColor = "#05DBFC";
        backButton.style.transform = "scale(1.05)";
    });
    
    backButton.addEventListener("mouseleave", function() {
        backButton.style.backgroundColor = "#05B9FA";
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
    expandedPost.style.backgroundColor = "#10406a";
    expandedPost.style.fontFamily = "'Inter', sans-serif";
    expandedPost.style.borderRadius = "3rem";
    expandedPost.style.boxShadow = "0 8px 32px rgba(5, 185, 250, 0.2)";

    // Post title
    const postTitle = document.createElement("div");
    postTitle.textContent = "About This Site";
    postTitle.style.backgroundColor = "#05B9FA";
    postTitle.style.color = "#01080f";
    postTitle.style.padding = "24px";
    postTitle.style.marginBottom = "20px";
    postTitle.style.borderRadius = "3rem";
    postTitle.style.fontSize = "42px";
    postTitle.style.fontWeight = "bold";
    expandedPost.appendChild(postTitle);

    // Post date
    const postDate = document.createElement("div");
    postDate.textContent = "Published: " + formatDate("08/18/2026");
    postDate.style.backgroundColor = "#042745";
    postDate.style.color = "#05DBFC";
    postDate.style.padding = "30px 20px";
    postDate.style.marginBottom = "16px";
    postDate.style.borderRadius = "3rem";
    postDate.style.fontSize = "16px";
    postDate.style.fontWeight = "600";
    expandedPost.appendChild(postDate);

    // Post meta (category and topic)
    const postMeta = document.createElement("div");
    postMeta.style.backgroundColor = "#042745";
    postMeta.style.color = "#FFFFFF";
    postMeta.style.padding = "30px 20px";
    postMeta.style.marginBottom = "24px";
    postMeta.style.borderRadius = "3rem";
    postMeta.style.display = "flex";
    postMeta.style.gap = "32px";
    postMeta.style.flexWrap = "wrap";
    postMeta.style.fontSize = "16px";
    postMeta.style.fontWeight = "500";

    const categorySpan = document.createElement("span");
    categorySpan.innerHTML = "<strong style='color: #05DBFC;'>Category:</strong> Information";
    postMeta.appendChild(categorySpan);

    const topicSpan = document.createElement("span");
    topicSpan.innerHTML = "<strong style='color: #05DBFC;'>Topic:</strong> This Website";
    postMeta.appendChild(topicSpan);

    expandedPost.appendChild(postMeta);

    // Post content
    const postContent = document.createElement("div");
    postContent.textContent = "This is my official portfolio website where I showcase my current projects and have my very own blog with posts I add whenever I can.";
    postContent.style.backgroundColor = "#021f38";
    postContent.style.color = "#FFFFFF";
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