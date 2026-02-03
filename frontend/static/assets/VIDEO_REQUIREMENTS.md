# Demo Video Requirements

## Recommended Scene: Classroom

### Why Classroom
- Universal—every parent/educator connects immediately
- "This is where my child spends 6 hours" hits emotionally
- Rich but contained sensory environment
- High emotional stakes

### Required Elements

| Element | Why It Matters | Example |
|---------|----------------|---------|
| Students at desks | Movement that becomes distracting | Fidgeting, writing, shifting |
| Fluorescent lights | Subtle flicker amplifies at high precision | Overhead panel lighting |
| Background audio layers | Multiple sounds to separate/amplify | Pencils, whispers, HVAC, clock |
| Teacher presence | Adds unpredictability | Speaking, moving around |
| Clock visible | Iconic classroom element + ticking sound | Wall clock |
| Some window light | Outdoor sounds bleeding in | Birds, traffic, playground |

### Technical Requirements
- Resolution: 720p minimum
- Duration: 30+ seconds (will trim to 45s)
- Audio: Must have ambient sounds (not silent)
- License: Must allow redistribution (CC0, CC-BY, or royalty-free)

### Recommended Sources

**Option A - Pexels (Recommended):**
- https://www.pexels.com/search/videos/classroom%20students/
- https://www.pexels.com/search/videos/school%20classroom/
- https://www.pexels.com/search/videos/elementary%20school/

**Option B - Pixabay:**
- https://pixabay.com/videos/search/classroom/
- https://pixabay.com/videos/search/elementary%20school/
- https://pixabay.com/videos/search/students%20desk/

**Option C - Creative Commons YouTube:**
- Search: "classroom ambience ASMR"
- Search: "classroom background noise study"
- Search: "school classroom ambient sounds"
- Filter by Creative Commons license

### Processing Commands

Once you have the video:

```bash
# Trim to 45 seconds, scale to 720p, optimize for web
ffmpeg -i raw_video.mp4 -t 45 -vf "scale=720:480" -c:v libx264 -crf 23 -c:a aac -b:a 128k frontend/static/assets/classroom.mp4

# Extract audio separately (optional)
ffmpeg -i frontend/static/assets/classroom.mp4 -vn -c:a pcm_s16le frontend/static/assets/classroom.wav
```

### File Naming
- Video: `classroom.mp4`
- Audio (if separate): `classroom.wav`
