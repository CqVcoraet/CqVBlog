"use strict"

export const SYSTEM_FONT_NAME = "system";

export class Font {
    constructor(fontName, fontLink) {
        this.fontName = fontName;
        this.fontLink = fontLink;
    }
}

function isSystemFont(fontName) {
    return ["system", "system font", "device system font", "system-ui"].includes(fontName.trim().toLowerCase());
}

function getFontFamily(fontName) {
    if (isSystemFont(fontName)) {
        return "system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif";
    }

    return JSON.stringify(fontName);
}

export function applyFont(font) {
    if (!(font instanceof Font)) {
        throw new TypeError("applyFont expects a Font instance.");
    }

    if (!font.fontName || typeof font.fontName !== "string") {
        throw new TypeError("Font must have a valid fontName.");
    }

    const applyFontFamily = () => {
        let fontStyleElement = document.getElementById("global-font-style");

        if (!fontStyleElement) {
            fontStyleElement = document.createElement("style");
            fontStyleElement.id = "global-font-style";
            document.head.appendChild(fontStyleElement);
        }

        const fontFamily = getFontFamily(font.fontName);
        fontStyleElement.textContent = `html, body, body * { font-family: ${fontFamily} !important; }`;

        localStorage.setItem("selectedFont", JSON.stringify({
            fontName: font.fontName,
            fontLink: font.fontLink
        }));
    };

    if (isSystemFont(font.fontName) || !font.fontLink) {
        applyFontFamily();
        return Promise.resolve();
    }

    let fontLinkElement = document.querySelector(`link[data-font-name="${CSS.escape(font.fontName)}"]`);

    if (!fontLinkElement) {
        fontLinkElement = document.createElement("link");
        fontLinkElement.rel = "stylesheet";
        fontLinkElement.href = font.fontLink;
        fontLinkElement.dataset.fontName = font.fontName;
        document.head.appendChild(fontLinkElement);
    }

    return new Promise((resolve, reject) => {
        const finishLoading = () => {
            applyFontFamily();
            resolve();
        };

        if (fontLinkElement.sheet) {
            finishLoading();
            return;
        }

        fontLinkElement.addEventListener("load", finishLoading, { once: true });
        fontLinkElement.addEventListener("error", () => reject(new Error(`Failed to load font: ${font.fontName}`)), { once: true });
    });
}