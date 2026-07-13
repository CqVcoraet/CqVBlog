"use strict";

class CustomAlert {

    constructor(message, overlayColor, btnColor, textColor, btnTextColor, ...buttons) {
        this.message = message;
        this.overlayColor = overlayColor;
        this.btnColor = btnColor;
        this.textColor = textColor;
        this.btnTextColor = btnTextColor;
        this.buttons = buttons;
    }

    renderAlert() {
        // Log to console just to make debugging a bit easier
        console.log(`Alert Rendering: ${this.message}`);

        // 1. Create the Overlay
        let overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            zIndex: "9999",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        });

        // 2. Create the Alert Box
        let alertBox = document.createElement("div");
        Object.assign(alertBox.style, {
            background: this.overlayColor,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "32px 48px",
            borderRadius: "20px",
            fontFamily: "Inter, sans-serif",
            fontSize: "22px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
            color: this.textColor
        });
        alertBox.innerHTML = `<strong>${this.message}</strong>`;

        // 3. Generate Variable Buttons
        this.buttons.forEach(btnConfig => {
            let btn = document.createElement("button");
            btn.innerHTML = btnConfig.label;

            // Base Styles
            Object.assign(btn.style, {
                marginTop: "20px",
                padding: "10px 30px",
                fontSize: "18px",
                fontWeight: "bold",
                background: this.btnColor,
                color: this.btnTextColor,
                border: "none",
                borderRadius: "50rem",
                cursor: "pointer",
                width: "100%",
                transition: "transform 0.2s ease"
            });

            // Hover Effect (Scales to 1.1x)
            btn.addEventListener("mouseenter", () => {
                btn.style.transform = "scale(1.1)";
            });

            // Reset Scale when mouse leaves
            btn.addEventListener("mouseleave", () => {
                btn.style.transform = "scale(1)";
            });

            // Mouse Down (Scales to 1.2x)
            btn.addEventListener("mousedown", () => {
                btn.style.transform = "scale(1.2)";
            });

            // Reset Scale after click (ensures clean release)
            btn.addEventListener("mouseup", () => {
                btn.style.transform = "scale(1.1)";
            });

            btn.onclick = () => {
                if (btnConfig.callback) {
                    btnConfig.callback();
                }
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            };

            alertBox.appendChild(btn);
        });

        overlay.appendChild(alertBox);
        document.body.appendChild(overlay);
    }
}