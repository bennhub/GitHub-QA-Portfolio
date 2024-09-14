# Test Botter 

## Description

**Test Botter**  is a tool I designed to assist in generating test cases using AI. It leverages custom prompts to generate common test cases or get it to come up with some out of the box scenarios for your features - this is for helping quality assurance engineers streamline their testing processes. More features are coming soon to further enhance the capabilities of this tool. I don't want this to just be a test case generator, it will contain more AI-QA related features. 

I created this tool utilizing Google Gemini AI Modal - to help with testing, providing an AI bot that you can reach out to for assistance whenever needed.


![](https://raw.githubusercontent.com/bennhub/GitHub-QA-Portfolio/6b584793888b9a8d4899fad0d0477a19e578c844/AI-QA%20Projects/ai_bot_testcase_3.gif
)



## Features

- Generate common test cases using custom prompts
- User-friendly interface for interacting with the AI
- Efficient and quick test case generation
- More features coming soon...


## Installation and Setup

1. **Clone the Repository**
```bash
git clone [repository-url]
```

2. **Install Dependencies**
Navigate to the project directory and install the required dependencies:

3. **Install Required Libraries**
Install Google Generative AI and markdown-it libraries:
```bash
npm install @google/generative-ai markdown-it
```

4. **Environment Variables**
Set up the `.env` file with your Google Generative AI API Key:
```bash
VITE_API_KEY=your_api_key_here
```

5. **Run the Application**
Start the application locally:
```bash
npm run dev
```

6. **Open in Browser**
The AI-buddy will be available at `http://localhost:3000` (default URL).

## Usage

 - **Enter Your Details:** Fill in the input fields with your test case details and descriptions, then click "Add Test Case" to add them to the list below.

 - **Generate Test Scenarios:** Choose test cases from the list to have the AI generate detailed scenarios based on them.

 - **Customize Test Cases:** For permanent test cases, you can directly edit the JSON file with your custom prompts.

 - **Personalize Your AI:** Have fun by giving your AI a personality that makes interactions enjoyable!

