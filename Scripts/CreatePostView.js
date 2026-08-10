"use strict"

import { database } from "./firebaseConfig.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const Category = Object.freeze({
    PERSONAL_DEVELOPMENT: 'Personal Development',
    SCIENCE: 'Science',
    TECHNOLOGY: 'Technology',
    MYSTICISM: 'Mysticism',
    SOCIETY: 'Society',
    POLITICS: 'Politics',
    GOVERNMENT: 'Government',
    LIFE_PURPOSE: 'Life Purpose',
    RELATIONSHIPS: 'Relationships',
    HEALTH_STUFF: 'Health Stuff',
    INTELLECTUAL_STUFF: 'Intellectual Stuff',
    OFF_TOPIC: 'Off Topic',
    OTHER: 'Other'
});

function successAlert(message) {
    let alert = new CustomAlert(message, "#007722", "#FFFFFF", "#FFFFFF", "#007722", 
        {
            label: "OK",
            callback: () => {}
        }
    );
    alert.renderAlert();
}

function warnAlert(message) {
    let alert = new CustomAlert(message, "#FFC900", "#000000", "#000000", "#FFC900", 
        {
            label: "OK",
            callback: () => {}
        }
    );
    alert.renderAlert();
}

function errorAlert(message) {
    let alert = new CustomAlert(message, "#D20000", "#FFFFFF", "#FFFFFF", "#D20000", 
        {
            label: "OK",
            callback: () => {}
        }
    );
    alert.renderAlert();
}

class CreatePostView {

    constructor(title, content, selectedCategory, topic) {
        this.title = title;
        this.content = content;

        if (!Object.values(Category).includes(selectedCategory)) {
            throw new Error(`Invalid category: ${selectedCategory}. Must be a valid category of the following:
                1. PERSONAL_DEVELOPMENT
                2. SCIENCE
                3. TECHNOLOGY
                4. MYSTICISM
                5. SOCIETY
                6. POLITICS
                7. GOVERNMENT
                8. LIFE_PURPOSE
                9. RELATIONSHIPS
                10. HEALTH_STUFF
                11. INTELLECTUAL_STUFF
                12. OFF_TOPIC
                13. OTHER
            `);
        }

        this.selectedCategory = selectedCategory;
        this.topic = topic;
    }

    renderView() {
        console.log(`Create Post View Rendering`);

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
            background: "#03468F",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            padding: "32px 36px",
            borderRadius: "2rem",
            fontFamily: "Inter, sans-serif",
            fontSize: "22px",
            fontWeight: "bold",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.2)",
            color: "#FFFFFF",
            width: "100%",
            maxWidth: "560px"
        });

        let title = document.createElement("h2");
        title.textContent = "Create New Post";
        Object.assign(title.style, {
            margin: "0 0 20px",
            fontSize: "28px",
            textAlign: "center"
        });

        let form = document.createElement("form");
        Object.assign(form.style, {
            display: "flex",
            flexDirection: "column",
            gap: "14px"
        });

        const createField = (labelText, inputType, placeholder, isTextArea = false) => {
            const field = document.createElement("label");
            Object.assign(field.style, {
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "16px",
                fontWeight: "600"
            });

            const label = document.createElement("span");
            label.textContent = labelText;

            let input;
            if (isTextArea) {
                input = document.createElement("textarea");
                Object.assign(input.style, {
                    minHeight: "240px",
                    resize: "vertical"
                });
            } else {
                input = document.createElement("input");
                input.type = inputType;
            }

            Object.assign(input.style, {
                padding: "12px 14px",
                borderRadius: "1.5rem",
                border: "1px solid rgba(255,255,255,0.3)",
                fontFamily: "Inter, sans-serif",
                fontSize: "16px",
                outline: "none"
            });

            input.placeholder = placeholder;
            field.append(label, input);
            return field;
        };

        const titleField = createField("Title", "text", "Enter post title");
        const titleInput = titleField.querySelector("input, textarea");
        const contentField = createField("Content", "text", "Write your post here", true);
        const contentInput = contentField.querySelector("input, textarea");
        const categoryField = document.createElement("label");
        Object.assign(categoryField.style, {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            fontSize: "16px",
            fontWeight: "600"
        });

        const categoryLabel = document.createElement("span");
        categoryLabel.textContent = "Category";

        const categorySelect = document.createElement("select");
        Object.assign(categorySelect.style, {
            padding: "12px 14px",
            borderRadius: "0.9rem",
            border: "1px solid rgba(255,255,255,0.3)",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            outline: "none"
        });

        Object.values(Category).forEach((category) => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        categoryField.append(categoryLabel, categorySelect);

        const topicField = document.createElement("label");
        Object.assign(topicField.style, {
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            fontSize: "16px",
            fontWeight: "600"
        });

        const topicLabel = document.createElement("span");
        topicLabel.textContent = "Topic";

        const topicInput = document.createElement("input");
        topicInput.type = "text";
        topicInput.placeholder = "Enter topic";
        Object.assign(topicInput.style, {
            padding: "12px 14px",
            borderRadius: "1.5rem",
            border: "1px solid rgba(255,255,255,0.3)",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            outline: "none"
        });

        topicField.append(topicLabel, topicInput);

        const buttonRow = document.createElement("div");
        Object.assign(buttonRow.style, {
            display: "flex",
            gap: "12px",
            marginTop: "8px"
        });

        let submitBtn = document.createElement("button");
        submitBtn.type = "submit";
        submitBtn.textContent = "Submit Post";
        Object.assign(submitBtn.style, {
            padding: "12px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            background: "#FFFFFF",
            color: "#03468F",
            border: "none",
            borderRadius: "50rem",
            cursor: "pointer",
            transition: "transform 0.2s ease"
        });

        let cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.textContent = "Cancel";
        Object.assign(cancelBtn.style, {
            padding: "12px 20px",
            fontSize: "16px",
            fontWeight: "bold",
            background: "transparent",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.6)",
            borderRadius: "50rem",
            cursor: "pointer",
            transition: "transform 0.2s ease"
        });

        [submitBtn, cancelBtn].forEach((button) => {
            button.addEventListener("mouseenter", () => {
                button.style.transform = "scale(1.05)";
            });
            button.addEventListener("mouseleave", () => {
                button.style.transform = "scale(1)";
            });
        });

        cancelBtn.addEventListener("click", () => {
            if (document.body.contains(overlay)) {
                document.body.removeChild(overlay);
            }
        });

        submitBtn.addEventListener("click", (event) => {
            event.preventDefault();

            const titleValue = titleInput.value.trim();
            const contentValue = contentInput.value.trim();
            const categoryValue = categorySelect.value.trim();
            const topicValue = topicInput.value.trim();

            if (!titleValue || !contentValue || !topicValue) {
                const errorAlert = new CustomAlert(
                    "Please enter both a title and some content.",
                    "#D20000",
                    "#FFFFFF",
                    "#FFFFFF",
                    "#D20000",
                    {
                        label: "OK",
                        callback: () => {}
                    }
                );
                errorAlert.renderAlert();
                return;
            }

            const createdPost = {
                title: titleValue,
                content: contentValue,
                category: categoryValue,
                topic: topicValue,
                date: new Date().toISOString()
            };

            // Add post to firestore
            addDoc(collection(database, "posts"), createdPost)
                .then((docRef) => {
                    console.log("Document written with ID: ", docRef.id);
                    successAlert("Successfully added post")
                    
                })
                .catch((error) => {
                    console.error("Error adding document: ", error);
                    errorAlert("Failed to add post")
                });
            
        });

        buttonRow.append(cancelBtn, submitBtn);
        form.append(titleField, contentField, categoryField, topicField, buttonRow);
        viewBox.append(title, form);
        overlay.appendChild(viewBox);
        document.body.appendChild(overlay);
    }
}

window.CreatePostView = CreatePostView;
window.Category = Category;