# Forest Ambient Audio

This folder contains the forest ambient sound files for the website.

## Required Audio Files

You need to add the following audio files to this folder:

1. **forest-ambience.mp3** - Primary audio file (MP3 format)
2. **forest-ambience.ogg** - Fallback audio file (OGG format) for better browser compatibility

## Where to Get Free Forest Sounds

### Recommended Free Sources:

1. **Freesound.org**
   - URL: https://freesound.org/
   - Search for: "forest ambience", "birds chirping", "nature sounds"
   - License: Many files under Creative Commons (check individual licenses)

2. **YouTube Audio Library**
   - URL: https://studio.youtube.com/
   - Navigate to: Audio Library > Sound Effects
   - Search for: "forest", "nature", "birds"
   - License: Free to use (no attribution required)

3. **Pixabay**
   - URL: https://pixabay.com/sound-effects/
   - Search for: "forest sounds", "nature ambience"
   - License: Free for commercial use

4. **BBC Sound Effects**
   - URL: https://sound-effects.bbcrewind.co.uk/
   - Search for: "forest", "woodland", "birdsong"
   - License: RemArc license (check terms)

5. **Zapsplat**
   - URL: https://www.zapsplat.com/
   - Search for: "forest ambience"
   - License: Free with attribution

## Recommended Search Terms:
- "forest ambience"
- "woodland sounds"
- "birds chirping forest"
- "nature soundscape"
- "peaceful forest"
- "rainforest ambience"

## Tips for Choosing Audio:

1. **Duration**: Choose files that are at least 2-3 minutes long for seamless looping
2. **Volume**: Select gentle, subtle sounds (not too loud or intrusive)
3. **Quality**: Prefer high-quality recordings (at least 128kbps)
4. **Content**: Look for:
   - Gentle bird chirping
   - Rustling leaves
   - Light wind
   - Distant water streams (optional)
   - No sudden loud noises

## Converting Audio Format:

If you only have MP3, you can convert to OGG using:

### Online Converters:
- https://cloudconvert.com/mp3-to-ogg
- https://www.online-convert.com/

### Desktop Software:
- **Audacity** (Free): File > Export > Export as OGG
- **FFmpeg** (Command line):
  ```bash
  ffmpeg -i forest-ambience.mp3 -c:a libvorbis -q:a 4 forest-ambience.ogg
  ```

## File Specifications:

### Recommended Settings:
- **Format**: MP3 and OGG
- **Bitrate**: 128-192 kbps
- **Sample Rate**: 44100 Hz
- **Channels**: Stereo
- **File Size**: Keep under 5MB for faster loading

## License Compliance:

Always check and comply with the license of any audio file you use:
- Some require attribution in your website footer
- Some are free for personal use only
- Some are completely free for commercial use

Add attribution in your website footer if required, for example:
```html
<p>Forest sounds by [Author Name] from [Source] (CC BY 4.0)</p>
```

## Current Implementation:

The audio player is set to:
- Loop continuously
- Start at 30% volume
- Allow user control via toggle button
- Pause when page is not visible
- Respect user preference (starts muted)

## Testing:

After adding the audio files:
1. Open index.html in a browser
2. Look for the "Forest Sounds" button in the bottom-right corner
3. Click to toggle audio on/off
4. Hover over the control to adjust volume
5. Check that audio loops seamlessly
