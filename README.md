# Spotify Web AI DJ - create the perfect mix of music using an agentic natural voice interface to talk to the Spotify API powered by Google Gemma 2 running entirely client side

A Web AI Agent running entirely client side in browser, that's capable of generating a spotify playlist using Google's Gemma 2 (2B) model in JavaScript via WebGPU thanks to the MediaPipe Web LLM library, combined with some extra function calling logic to enable advanced user experiences and get the job done requested by the user.

Click the image below to watch the YouTube video of it in action:

[![Watch this Web AI Agent demo in action on YouTube](https://github.com/jasonmayes/Web-AI-Spotify-DJ/blob/main/WebAISpotifyDJScreenshot.jpg?raw=true)](https://www.youtube.com/watch?v=VfTiE4IllzU)


## Prerequisites

* Chrome - as the LLM is accelerated using WebGPU
* A computer with a GPU - most will work so long as 4.5GB VRAM, but if you have a dedicated GPU it will usually be much faster.
* The model file is a 2.5GB download! Be patient.


## Demo time

A [live demo is available on Glitch](https://spotify-web-ai-agent-dj.glitch.me/). Just click and open the link and wait for the 2.5GB model download - it will take time so use good WiFi when opening!

If any issues open the blue side panel on the right by hoving over it and click the clear memory button at the bottom to start over if you managed to get the Agent into an odd state. You can also create and specify your own private API keys in the right side panel if you want to listen to full songs instead of the previews you get when not using a Spotify Premium account's API key.


## Learn More

Designed and coded by Jason Mayes, 2025.

Learn more about the base project this code is based on:

* YouTube video: [https://www.youtube.com/watch?v=IC256KyITLw](https://www.youtube.com/watch?v=IC256KyITLw)
* Github: [https://github.com/jasonmayes/WebAIAgent](https://github.com/jasonmayes/WebAIAgent)

## Questions / Contact

I will be adding to this over time but if you have any questions / feedback then you can find me over on LinkedIn or Twitter:

* [https://www.linkedin.com/in/webai/](https://www.linkedin.com/in/webai/)
* [https://x.com/jason_mayes](https://x.com/jason_mayes)

