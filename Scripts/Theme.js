"use strict"

export class Theme {
    constructor(backgroundColor, navBackgroundColor, topBarBg, topBarBg2, textColor, accentColor, createBtnColor, signInBtnColor, bgOverlayColor, postContainerBg, postContentBg, postMetaBg, postAccentText, createPostBg) {
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
        this.createPostBg = createPostBg;
    }
}

export function applyTheme(theme) {
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
    root.style.setProperty('--create-post-bg', theme.createPostBg);

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
        postAccentText: theme.postAccentText,
        createPostBg: theme.createPostBg
    }));
}
