<a name="readme-top"></a>

<br />
<div align="center">
  	<h2 align="center">Wordverse</h2>
	<h3>FBLA Game Development 2022-2023</h3>
  	<p align="center">
    	A competitive multiplayer word game. By Bryan Lawless & Jack Houchin.
    	<br />
		<br />
    	<a href="https://wordverse.vercel.app/">View Demo</a>
    	·
    	<a href="https://github.com/TheLawlessDev/Wordverse/issues">Report Bug</a>
    	·
    	<a href="https://github.com/TheLawlessDev/Wordverse/issues">Request Feature</a>
  	</p>
</div>

<br>

## 📜 About the Project

![Wordverse](./wordverse.png?raw=true "Wordverse Home")

Wordverse is a multiplayer platform where players can create and join rooms to play a variety of competitive word games. We chose to use web technologies instead of platforms like Unity or other game frameworks. This allows people to play the game without any required download. It also opens the door for cross platform mobile and desktop applications down the road.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 📝 Requirements Met

Our project meets the following requirements from the guidelines stated here: [FBLA Topics](https://www.fbla-pbl.org/fbla-topics/).

- [x] The game should be an executable game, either through the internet or through a local installation.
  - The game can be ran using the internet, without any download.
- [x] The game should contain a scoreboard.
  - A scoreboard along with coin and trophy count are displayed to all players.
- [x] The game should contain a leader board and celebratory messages.
  - The player receives messages depending on if they got a correct answer, a leader board is displayed at the end of the game.
- [x] The game should have a minimum of three levels.
  - The word level increases in difficultly depending on the score that you have.
- [x] The game should have an instructional display.
  - The game has a "How to Play" popup dialog on the home screen.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🧰 Core Technologies Used

| Technology                                                                                                                   | Description                               | Link                     |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------ |
| ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)                      | Runtime environment for JavaScript        | https://nodejs.org/en/   |
| ![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)            | Frontend JavaScript framework.            | https://vuejs.org/       |
| ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)                       | Frontend module and asset bundler.        | https://vitejs.dev/      |
| ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)              | Library for bi-directional communication. | https://socket.io/       |
| ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)              | Database and storage solution.            | https://www.mongodb.com/ |
| ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)                 | Hosting for backend codebase.             | https://www.heroku.com/  |
| ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)                 | Hosting for frontend codebase.            | https://vercel.com/      |
| ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) | Frontend CSS framework.                   | https://tailwindcss.com/ |
| ![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=Twilio&logoColor=white)                        | STUN/TURN servers for voice calling.      | https://www.twilio.com/  |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🔧 Installation

### Prerequisites

- NodeJS 16+
- A MongoDB Account

1. Clone the repo `git clone https://github.com/TheLawlessDev/Wordverse.git`
2. Open a terminal in the cloned folder.
3. Navigate to `cd ./server` in the terminal, then run `npm install`.
4. Repeat the previous step for the `./client` folder.
5. Configure the `.env` files in both the `./client` and `./server` folder. Refer to the `.env.example` file in each folder for reference on how to setup these values.
6. Once configured, run `npm run dev` in first the `./client` folder, then the `./server` folder.
7. The client and server should be running on the following localhost ports:
   - **Client:** http://127.0.0.1:5173/
   - **Server:** http://127.0.0.1:5000/

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 💾 Inner Workings

This project has a lot of moving parts, the core inner-workings are explained below.

- **Peer-to-peer Voice Calling Flow**

  - When a player joins a game, they are given a list of other player ids that are currently in the voice chat.
  - When a player joins the voice chat, their socket id is added to the game room voice store.
  - A payload will be sent to the player in order to establish a connection with Twilio's STUN/TURN servers.
  - The player will then be prompted to provide permission in order for the game to use their microphone.
    - If they do not have a working microphone, they will be unable to join the voice chat.
  - After permission is given, the player will establish a WebRTC connection with others already in the voice chat.
  - The player will then be able to hear and speak to other players in the voice chat.
  - Upon disconnecting from the voice chat, the player will be removed from the game room voice store and the WebRTC connection will be closed.

<hr>

- **Websocket Gateway & Game Flow**

  - When a player first loads onto the page, they are immediately connected to the websocket server.
    - The player will be assigned a unique socket ID, in the future this will be replaced with a persistent session token.
  - The player will receive a unique socket ID each time they connect.
  - **Game Flow**
    - When a player joins a game and chooses a nickname, they are added to the game room.
    - The game room is the ID of the game.
    - The `UPDATE_PLAYER_LIST` event is emitted to all the players in the room currently in the starting lobby.
    - The `PLAYER_JOIN_SUCCESS` event is emitted to the connecting player if they were able to join the game room successfully.
  - From here the player is currently waiting for the game host to start the game.
  - Once the host starts the game, the `GAME_STARTING` event is emitted to all players in the game room.
    - If the host unexpectedly disconnects from a game, the players are redirected to the join page.
  - The `GAME_TIMER_SET` event is emitted to all players in the game room.
    - A future timestamp is sent with this event to the client; the client will manage the timer. This saves server resources.
  - The players will continue to receive and send back events and data based on the game mode they are playing.
  - Once the game concludes, the `GAME_OVER` event will be emitted to all players in the game room.
  - All players in the game room will then be redirected to the leader board or end game screen.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🧹 Code Formatting and Structure

- The layout and design of the frontend and backend is adapted from CLEAN architecture principles. These design principles separate the presentation layer, logic layer, model layer, and database layer.

- Code security, style, and best practices are kept track of using [DeepSource](https://deepsource.io/).

- Code and Variable Formatting
  - All code is formatted using Prettier and linted with eslint.
  - General variables and function arguments use camel case.
    - Example: `helloWorld`.
  - All constants, config or environment variables use snake case with all uppercase letters.
    - Example: `HELLO_WORLD`.
  - Object, map or JSON keys use snake case with all lowercase letters.
    - Example: `hello_world`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🚧 Future Road Map

- [x] Improve websocket infrastructure.
- [ ] Improve spam protection and security.
- [x] Text chat.
- [x] Peer-to-peer voice chat.
- [x] Design improvements.
- [ ] Improve responsiveness.
- [ ] Different game-modes.
- [x] Improve in-memory stores.
- [x] General code cleanup and improvements.

See the [open issues](https://github.com/TheLawlessDev/Wordverse/issues) for a full list of proposed features as well as known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 📜 License

Distributed under the GNU Affero General Public License v3.0. See `LICENSE` or https://choosealicense.com/licenses/agpl-3.0/ for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🪙 Acknowledgments

- [Markdown Badges](https://github.com/Ileriayo/markdown-badges)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
