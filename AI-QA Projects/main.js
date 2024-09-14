import { GoogleGenerativeAI } from "@google/generative-ai";
import md from "markdown-it";

// Initialize the model
const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

let history = [];
let testCases = [];

// Function to send prompt to the AI model and get response
async function getResponse(userPrompt) {
  const personality = "You have the personality of the top quality assurance engineer in the world. Respond only in this style, don't respond as the assistant.";
  const fullPrompt = `${personality}\n\n${userPrompt}`;

  const chat = await model.startChat({ history: history });
  const result = await chat.sendMessage(fullPrompt);
  const response = await result.response;
  const text = response.text();

  console.log("AI response:", text); // Log the response text for debugging
  return text;
}

// User chat div
export const userDiv = (data) => {
  return `
  <!-- User Chat -->
  <div class="flex items-center gap-2 justify-start m-2">
    <img src="human.png" alt="user icon" class="w-10 h-10 rounded-full"/>
    <div class="bg-gemDeep text-black p-1 rounded-md shadow-md mx-2">${data}</div>
  </div>
  `;
};

// AI chat div with copy button inside the response div
export const aiDiv = (data) => {
  return `
  <!-- AI Chat -->
  <div class="flex gap-2 justify-end m-2">
    <div class="bg-gemDeep text-black p-1 rounded-md shadow-md mx-2 relative">
      <button class="copy-btn absolute top-0 right-0 bg-blue-500 text-white p-1 rounded-md shadow-md mx-2">Copy</button>
      ${data}
    </div>
    <!-- <img src="bot.png" alt="bot icon" class="w-10 h-10 rounded-full"/> -->
  </div>
  `;
};

async function handleSubmit(event) {
  event.preventDefault();

  let userMessage = document.getElementById("prompt");
  const chatArea = document.getElementById("chat-container");

  const userPrompt = userMessage.value.trim();
  if (userPrompt === "") {
    return;
  }

  console.log("User message:", userPrompt);

  // Display user message in chat
  const userContent = userDiv(md().render(userPrompt));
  chatArea.innerHTML += userContent;
  userMessage.value = "";

  try {
    // Get AI response
    const aiResponse = await getResponse(userPrompt);
    const md_text = md().render(aiResponse);
    
    // Display AI response in chat
    const aiContent = aiDiv(md_text);
    chatArea.innerHTML += aiContent;

    // Scroll to the start of the new AI content
    const newMessage = chatArea.lastElementChild;
    newMessage.scrollIntoView({ behavior: "smooth", block: "start" });

    // Store message history
    history.push({ role: "user", parts: userPrompt });
    history.push({ role: "model", parts: aiResponse });

    // Add copy functionality
    addCopyFunctionality();

    console.log("History:", history);
  } catch (error) {
    console.error("Error getting AI response:", error);
  }
}

const chatForm = document.getElementById("chat-form");
chatForm.addEventListener("submit", handleSubmit);

chatForm.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) handleSubmit(event);
});

// Get the elements
const chatbotPopup = document.getElementById('chatbot-popup');
const openChatbotButton = document.getElementById('open-chatbot');
const closeChatbotButton = document.getElementById('close-chatbot');

// Function to open the chatbot
const openChatbot = () => {
  chatbotPopup.style.display = 'block';
};

// Event to open the chatbot
openChatbotButton.addEventListener('click', openChatbot);

// Event to close the chatbot
closeChatbotButton.addEventListener('click', () => {
  chatbotPopup.style.display = 'none';
});

// Open the chatbot by default when the page loads
document.addEventListener("DOMContentLoaded", openChatbot);

// Function to load test cases from JSON file
async function loadTestCases() {
  try {
    const response = await fetch('/testCasePrompts.json'); // Adjust the path to your JSON file
    const data = await response.json();
    testCases = data.testCases;
    return testCases;
  } catch (error) {
    console.error("Error loading test cases:", error);
    return [];
  }
}

// Function to display test cases as clickable list items
function displayTestCases() {
  const testCaseList = document.getElementById('test-case-list');
  testCaseList.innerHTML = ''; // Clear the list before adding items

  testCases.forEach((testCase) => {
    const listItem = document.createElement('li');
    listItem.textContent = testCase.title;
    listItem.classList.add('test-case-item');
    listItem.addEventListener('click', async () => {
      const aiResponse = await getResponse(`show me test cases: ${testCase.title}\n${testCase.details}`);
      const chatArea = document.getElementById("chat-container");
      const md_text = md().render(aiResponse);
      const aiContent = aiDiv(md_text);

      // Display AI response in chat
      chatArea.innerHTML += aiContent;

      // Scroll to the start of the new AI content
      const newMessage = chatArea.lastElementChild;
      newMessage.scrollIntoView({ behavior: "smooth", block: "start" });

      // Add copy functionality
      addCopyFunctionality();
    });
    testCaseList.appendChild(listItem);
  });
}

// Load and display test cases when the page loads
document.addEventListener("DOMContentLoaded", async () => {
  await loadTestCases();
  displayTestCases();
});

// Function to handle new test case submission
const testCaseForm = document.getElementById('test-case-form');
const saveTestCaseBtn = document.getElementById('save-testcase-btn');

saveTestCaseBtn.addEventListener('click', () => {
  const titleInput = document.getElementById('testcase-title').value;
  const detailsInput = document.getElementById('testcase-details').value;

  if (titleInput.trim() === '' || detailsInput.trim() === '') {
    alert('Please fill out both fields!');
    return;
  }

  const newTestCase = {
    title: titleInput,
    details: detailsInput
  };

  // Temporarily add the new test case to the array
  testCases.push(newTestCase);
  
  // Update the test case list in the UI
  displayTestCases();

  // Clear the form inputs
  document.getElementById('test-case-form').reset();

  // Mock function to save the new test case to a JSON file (you will need to implement this on the backend)
  saveTestCaseToFile(newTestCase);
});

// Mock function to save test case to a JSON file
async function saveTestCaseToFile(testCase) {
  // Implement an actual API request or backend function to save the test case to the JSON file
  console.log("Saving test case to file:", testCase);
}

// Function to add copy functionality to all copy buttons
function addCopyFunctionality() {
  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const content = btn.parentElement.innerText; // Corrected to innerText to exclude button text
      navigator.clipboard.writeText(content).then(() => {
        console.log("Copied to clipboard: ", content);
      }).catch(err => {
        console.error("Failed to copy text: ", err);
      });
    });
  });
}
