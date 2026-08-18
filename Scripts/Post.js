"use strict"

class Post {

    constructor(title, content, category, topic, date) {
        this.title = title;
        this.content = content;
        this.category = category;
        this.topic = topic;
        this.date = date || new Intl.DateTimeFormat('en-US').format(new Date());
    }

    formatDate(dateStr) {
        // Parse the date string and format as mm/dd/yyyy
        const dateObj = new Date(dateStr);
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${month}/${day}/${year}`;
    }

    insert() {
        
    }

    openExpandedView() {
        // Store post data in sessionStorage
        const postData = {
            title: this.title,
            content: this.content,
            category: this.category,
            topic: this.topic,
            date: this.date
        };
        sessionStorage.setItem('expandedPost', JSON.stringify(postData));
        
        // Navigate to expanded view page
        window.location.href = '../HTML Pages/post-expanded.html';
    }

    append(body) {
        // Main container for the post
        let container = document.createElement("div");
        container.style.width = "90%";
        container.style.maxWidth = "800px";
        container.style.margin = "24px auto";
        container.style.padding = "24px";
        container.style.backgroundColor = "#10406a";
        container.style.fontFamily = "Inter, sans-serif";
        container.style.borderRadius = "3rem";
        container.style.boxShadow = "0 4px 12px rgba(5, 185, 250, 0.1)";
        container.style.transition = "transform 0.3s ease, box-shadow 0.3s ease";

        // Title div
        let titleDiv = document.createElement("div");
        titleDiv.style.backgroundColor = "#05B9FA";
        titleDiv.style.color = "#01080f";
        titleDiv.style.padding = "16px";
        titleDiv.style.marginBottom = "12px";
        titleDiv.style.borderRadius = "3rem";
        titleDiv.style.fontSize = "28px";
        titleDiv.style.fontWeight = "bold";
        titleDiv.style.transition = "transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease";
        titleDiv.style.cursor = "pointer";
        titleDiv.textContent = this.title;
        container.appendChild(titleDiv);

        titleDiv.addEventListener("mouseenter", function() {
            titleDiv.style.transform = "scale(1.01)";
        });

        titleDiv.addEventListener("mouseleave", function() {
            titleDiv.style.transform = "scale(1)";
        });

        titleDiv.addEventListener("mousedown", () => {
            titleDiv.style.transform = "scale(1.03)";
            this.openExpandedView();
        });

        titleDiv.addEventListener("mouseup", function() {
            titleDiv.style.transform = "scale(1.01)";
        });

        // Date div
        let dateDiv = document.createElement("div");
        dateDiv.style.backgroundColor = "#042745";
        dateDiv.style.color = "#05DBFC";
        dateDiv.style.padding = "16px 12px";
        dateDiv.style.marginBottom = "12px";
        dateDiv.style.borderRadius = "3rem";
        dateDiv.style.fontSize = "16px";
        dateDiv.style.fontWeight = "600";
        dateDiv.textContent = "Published: " + this.formatDate(this.date);
        container.appendChild(dateDiv);

        // Category and Topic div
        let metaDiv = document.createElement("div");
        metaDiv.style.backgroundColor = "#042745";
        metaDiv.style.color = "#FFFFFF";
        metaDiv.style.padding = "16px";
        metaDiv.style.marginBottom = "16px";
        metaDiv.style.borderRadius = "3rem";
        metaDiv.style.display = "flex";
        metaDiv.style.gap = "16px";
        metaDiv.style.fontSize = "14px";
        metaDiv.style.fontWeight = "500";

        let categorySpan = document.createElement("span");
        categorySpan.innerHTML = "<strong>Category:</strong> " + this.category;
        metaDiv.appendChild(categorySpan);

        let topicSpan = document.createElement("span");
        topicSpan.innerHTML = "<strong>Topic:</strong> " + this.topic;
        metaDiv.appendChild(topicSpan);

        container.appendChild(metaDiv);

        // Content div
        let contentDiv = document.createElement("div");
        contentDiv.style.backgroundColor = "#021f38";
        contentDiv.style.color = "#FFFFFF";
        contentDiv.style.padding = "20px";
        contentDiv.style.borderRadius = "3rem";
        contentDiv.style.lineHeight = "1.6";
        contentDiv.style.fontSize = "16px";
        contentDiv.textContent = this.content;
        container.appendChild(contentDiv);

        body.appendChild(container);
    }
}

export { Post };