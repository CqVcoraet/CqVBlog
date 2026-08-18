"use strict"

// Import Firebase database and Firestore functions
import { database } from './firebaseConfig.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { Post } from './Post.js';

// Get the main blog container element where posts will be displayed
let baseContainer = document.getElementsByClassName("blog-posts")[0];

// Variable to store all posts fetched from Firestore
let allPosts = [];

// Track which page the user is currently viewing
let currentPage = 1;

// Number of posts to display per page (adjust this to show more/fewer posts per page)
const postsPerPage = 8;

// Async function to fetch all posts from Firestore database
async function loadPosts() {
  try {
    // Create a query to fetch posts from the 'posts' collection
    // orderBy('date', 'desc') sorts posts by date, newest first
    const postsQuery = query(
      collection(database, 'posts'),
      orderBy('date', 'desc')
    );

    // Execute the query and get all matching posts
    const querySnapshot = await getDocs(postsQuery);
    allPosts = [];
    
    // Loop through each post document and extract its data
    querySnapshot.forEach((doc) => {
      const postData = doc.data();
      allPosts.push(postData);
    });

    // Display the first page of posts
    displayPage(1);
  } catch (error) {
    console.error('Error loading posts:', error);
  }
}

// Function to display a specific page of posts with pagination controls
function displayPage(pageNum) {
  // Update the current page variable
  currentPage = pageNum;
  
  // Clear all content from the container (removes previous posts and pagination)
  baseContainer.innerHTML = '';
  
  // Calculate which posts to show based on the current page number
  // Example: Page 1 shows posts 0-4, Page 2 shows posts 5-9, etc.
  const startIndex = (pageNum - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const postsToDisplay = allPosts.slice(startIndex, endIndex);
  
  // Calculate total number of pages needed
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  
  // Create and display each Post object for this page
  postsToDisplay.forEach((postData) => {
    const post = new Post(
      postData.title,
      postData.content,
      postData.category,
      postData.topic,
      postData.date
    );
    post.append(baseContainer);
  });
  
  // Only show pagination controls if there are multiple pages
  if (totalPages > 1) {
    // Create container for pagination buttons
    const paginationDiv = document.createElement("div");
    paginationDiv.style.display = "flex";
    paginationDiv.style.justifyContent = "center";
    paginationDiv.style.alignItems = "center";
    paginationDiv.style.gap = "16px";
    paginationDiv.style.margin = "32px 0";
    paginationDiv.style.padding = "24px";
    paginationDiv.style.backgroundColor = "#03213b";
    paginationDiv.style.borderRadius = "50rem";
    paginationDiv.style.width = "fit-content";
    paginationDiv.style.margin = "32px auto";
    
    // Create Previous button (only show if not on first page)
    if (pageNum > 1) {
      const prevBtn = document.createElement("button");
      prevBtn.textContent = "← Previous";
      prevBtn.style.padding = "10px 18px";
      prevBtn.style.backgroundColor = "#05B9FA";
      prevBtn.style.color = "#01080f";
      prevBtn.style.border = "none";
      prevBtn.style.borderRadius = "50rem";
      prevBtn.style.cursor = "pointer";
      prevBtn.style.fontWeight = "bold";
      prevBtn.style.fontSize = "16px";
      prevBtn.style.transition = "transform 0.25s ease, background-color 0.25s ease";
      
      // Add hover effects to Previous button
      prevBtn.addEventListener("mouseenter", function() {
        prevBtn.style.transform = "scale(1.05)";
        prevBtn.style.backgroundColor = "#05DBFC";
      });
      
      prevBtn.addEventListener("mouseleave", function() {
        prevBtn.style.transform = "scale(1)";
        prevBtn.style.backgroundColor = "#05B9FA";
      });
      
      // When clicked, display the previous page
      prevBtn.addEventListener("click", () => displayPage(pageNum - 1));
      paginationDiv.appendChild(prevBtn);
    }
    
    // Create page indicator showing current page and total pages
    const pageIndicator = document.createElement("span");
    pageIndicator.textContent = `Page ${pageNum} of ${totalPages}`;
    pageIndicator.style.color = "#05B9FA";
    pageIndicator.style.fontWeight = "bold";
    pageIndicator.style.fontSize = "16px";
    paginationDiv.appendChild(pageIndicator);
    
    // Create Next button (only show if not on last page)
    if (pageNum < totalPages) {
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Next →";
      nextBtn.style.padding = "10px 18px";
      nextBtn.style.backgroundColor = "#05B9FA";
      nextBtn.style.color = "#01080f";
      nextBtn.style.border = "none";
      nextBtn.style.borderRadius = "50rem";
      nextBtn.style.cursor = "pointer";
      nextBtn.style.fontWeight = "bold";
      nextBtn.style.fontSize = "16px";
      nextBtn.style.transition = "transform 0.25s ease, background-color 0.25s ease";
      
      // Add hover effects to Next button
      nextBtn.addEventListener("mouseenter", function() {
        nextBtn.style.transform = "scale(1.05)";
        nextBtn.style.backgroundColor = "#05DBFC";
      });
      
      nextBtn.addEventListener("mouseleave", function() {
        nextBtn.style.transform = "scale(1)";
        nextBtn.style.backgroundColor = "#05B9FA";
      });
      
      // When clicked, display the next page
      nextBtn.addEventListener("click", () => displayPage(pageNum + 1));
      paginationDiv.appendChild(nextBtn);
    }
    
    // Add the pagination controls to the container
    baseContainer.appendChild(paginationDiv);
  }
}

// When the page finishes loading, fetch and display the blog posts
document.addEventListener('DOMContentLoaded', loadPosts);