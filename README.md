## Overview

This project is a web-based application that allows users to draw on an HTML canvas. The canvas is pixelated, giving it a retro, low-resolution aesthetic. Users can zoom in and out, pan the canvas, and click to draw colored pixels at specific locations. The application also features a selector that highlights the pixel currently under the cursor.

## Features

1. **Canvas Drawing:**
   - Draw on a 1001x1001 pixel canvas by clicking.
   - The color of each pixel is randomly generated when clicked.

2. **Canvas Controls:**
   - **Zooming:** Use the mouse wheel to zoom in and out of the canvas.
   - **Panning:** Click and drag to pan across the canvas.

3. **Pixel Selector:**
   - A selector box follows the cursor to indicate which pixel is currently being hovered over.

4. **URL State Management:**
   - The zoom level and canvas position are stored in the URL hash, allowing users to bookmark specific views of their drawing.

5. **Performance Optimization:**
   - The canvas uses the `pixelated` property for image rendering, ensuring that zooming maintains the pixelated style.

## Project Structure

- **HTML (`index.html`):**
  - Defines the structure of the web page, including the canvas, navigation bar, and container elements.
  - Uses CSS variables to manage canvas position, zoom level, and selector appearance.

- **CSS (`main.css`):**
  - Styles the application, setting the layout and appearance of the canvas, selector, and other UI elements.
  - Utilizes CSS variables for dynamic styling based on JavaScript interaction.

- **JavaScript (`pixel.js`):**
  - Contains the logic for drawing on the canvas, handling user interactions (mouse movements, clicks, zooming), and updating the canvas view.
  - Functions include:
    - `drawCanvas()`: Initializes the canvas with a pattern.
    - `setZoom()`, `setCanvasPos()`: Manage zoom levels and canvas positioning.
    - `updateCoordinates()`, `updateSelector()`: Track and display the current pixel under the cursor.
    - `mouseDown()`, `mouseUp()`, `mouseMove()`: Handle panning of the canvas.
    - `zoomCanvas()`: Handle zooming with the mouse wheel.
    - `updateBookmark()`: Store the current state in the URL hash for easy bookmarking.
    - `drawPixel(x, y, colour)`: Draws a single pixel at the specified coordinates.

## Getting Started

### Prerequisites

- A modern web browser that supports HTML5, CSS3, and JavaScript.

### Installation

1. Clone the repository or download the source code.

   ```bash
   git clone https://github.com/yourusername/canvas-drawing-app.git
   ```

2. Open the `index.html` file in a web browser.

   ```bash
   open index.html
   ```

### Usage

- **Drawing:** Click anywhere on the canvas to draw a pixel with a randomly generated color.
- **Zooming:** Use the mouse wheel to zoom in and out.
- **Panning:** Click and drag to move the canvas around.
- **Bookmarking:** The canvas position and zoom level are saved in the URL. You can bookmark this URL to return to the same view later.

## Customization

### Modify Canvas Size

To change the size of the canvas, update the `X` and `Y` constants in the `pixel.js` file.

### Change Zoom Limits

The minimum and maximum zoom levels are controlled by the `ZOOMMIN` and `ZOOMMAX` constants in `pixel.js`. Adjust these values as needed.

## Future Improvements

- **Color Picker:** Allow users to select the color of the pixel they want to draw.
- **Undo Functionality:** Implement an undo feature to revert the last drawing action.
- **Save and Load:** Add options to save the current drawing and load previous drawings.