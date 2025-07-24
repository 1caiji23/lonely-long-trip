# Gamified Experience

This is a simple gamified web application that includes a scrolling background, a character, and a dialog box for interacting with a simulated AI.

## Features

*   **Scrolling Background:** The background continuously scrolls to create a dynamic scene.
*   **Character and Scenery:** A static foreground with a character and a seat.
*   **Dialog System:** A dialog box allows the user to send messages and receive simulated AI responses.
*   **Gamification Functions:** The application includes functions for starting the game, ending the game, triggering achievements, and displaying animations.

## How to Run

1.  **Clone the repository.**
2.  **Install the dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your environment variables.** Create a `.env` file in the root of the project and add your API key:
    ```
    OPENAI_API_KEY=your_api_key
    ```
4.  **Start the server:**
    ```bash
    node server.js
    ```
5.  **Open `index.html` in your web browser.**

## Project Structure

*   `index.html`: The main HTML file.
*   `styles/main.css`: The stylesheet for the application.
*   `scripts/main.js`: The JavaScript file containing the application logic.
*   `assets/`: A directory for storing images and other assets.

## Notes

*   The AI and text-to-speech functionalities are simulated. You will need to integrate your own services for these features.
*   You will need to provide your own images for the background, girl, and seat. Place them in the `assets` directory and name them `background.png`, `girl.png`, and `seat.png` respectively.
