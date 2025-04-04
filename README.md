# Text_to_speech 

A simple and elegant Text_to_speech web application with customizable voice options, pitch, speed, and volume controls.

## Features

- **Text-to-Speech Conversion**: Convert any text into spoken words
- **Voice Selection**: Choose from multiple system voices available on your device
- **Adjustable Controls**:
  - Pitch: Change the tone of the voice
  - Speed: Adjust how fast or slow the text is spoken
  - Volume: Control the loudness of the speech
- **Playback Controls**:
  - Speak: Start speech synthesis
  - Pause: Temporarily stop speech
  - Resume: Continue paused speech
  - Stop: Completely stop speech
- **Audio Download**: Save speech as an MP3 file (limited to 200 characters)
- **Responsive Design**: Works on both desktop and mobile devices

## Installation

1. Clone this repository or download the ZIP file:
   ```
   git clone https://github.com/Snehallaldas/Text_to_speech.git
   ```

2. Navigate to the project directory:
   ```
   cd Text_to_speech
   ```

3. Open `index.html` in your web browser.

## Usage

1. Enter or paste text into the text area
2. Select a voice from the dropdown menu
3. Adjust pitch, speed, and volume using the sliders
4. Click "Speak" to hear the text spoken aloud
5. Use the Pause, Resume, and Stop buttons to control playback
6. To download the speech as an audio file, click "Download Audio" (note the 200 character limit)

## Browser Compatibility

This application uses the Web Speech API, which is supported in most modern browsers:
- Chrome (desktop and Android)
- Edge
- Firefox
- Safari (desktop and iOS)

## File Structure

```
Text_to_speech/
├── index.html        # Main HTML document
├── styles.css        # CSS styling
├── script.js         # JavaScript functionality
└── README.md         # This file
```

## Customization

You can customize the application's appearance by modifying the `styles.css` file. The functionality can be extended by editing the `script.js` file.

## Limitations

- The download feature uses Google's Translate TTS API, which limits text to 200 characters
- Voice options depend on what's available on the user's operating system
- Some browsers may have limited support for certain voice features

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- This project uses the [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- Thanks to all contributors who have helped improve this project
