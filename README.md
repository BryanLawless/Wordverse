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

Wordverse is a multiplayer platform where users can create and join rooms to play a variety of competitive word games. We chose to use web technologies instead of platforms like Unity or other game frameworks. This allows users to play the game without any required download. It also opens the door for cross platform mobile and desktop applications down the road.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## Requirements Met

Our project meets the following requirements from the guidelines stated here: [FBLA Topics](https://www.fbla-pbl.org/fbla-topics/).

[x] The game should be an executable game, either through the Internet or through a local installation.
[x] The game should contain a scoreboard.
[x] The game should contain a leaderboard and celebratory messages.
[x] The game should have a minimum of three levels.
[x] The game should have an instructional display.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🧰 Core Technologies Used

| Technology                                                                                                        | Description                               | Link                     |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------ |
| ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)           | Runtime environment for JavaScript        | https://nodejs.org/en/   |
| ![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D) | Frontend JavaScript framework.            | https://vuejs.org/       |
| ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)            | Frontend module and asset bundler.        | https://vitejs.dev/      |
| ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)   | Library for bi-directional communication. | https://socket.io/       |
| ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)   | Database and storage solution.            | https://www.mongodb.com/ |
| ![Heroku](https://img.shields.io/badge/heroku-%23430098.svg?style=for-the-badge&logo=heroku&logoColor=white)      | Hosting for backend API and gateway.      | https://www.heroku.com/  |
| ![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)      | Hosting for frontend and UI assets.       | https://vercel.com/      |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🔧 Installation

### Prerequisites

- NodeJS 16+

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

This project has a lot of different parts, below is a description of the core functionalities.

- **API & Authentication Flow [ In Progress ]**

  - When a user fills out an authentication form (eg. login, register), a JSON payload is sent to the server authentication endpoint: `POST api/auth/login/`.
  - The authentication endpoint creates and signs a JWT token if the credentials are valid and correct.
  - The authentication endpoint then sends the JWT token to the client.
  - The client then stores this token in local storage to use for future API requests that require authentication.
  - The JWT token has a UUID that uniquely identifies each user for future requests.
  - A JWT token should not be shared with others, as it can be used to gain full access to a users account.

  <br/>

- **Websocket Gateway & Game Flow**
  - When a user first loads onto the page, they are immediately connected to the websocket server.
    - This will be changed in the future, to where the user is connected to the websocket server once they login.
  - The user will recieve a unique socket ID each time they connect.
  - **Game Flow**
    - When a user joins a game and chooses a nickname, they are added to the game room.
    - The game room is the ID of the game.
    - The `UPDATE_PLAYER_LIST` event is emitted to all the players in the room currently in the starting lobby.
    - The `PLAYER_JOIN_SUCCESS` event is emitted to the connecting user if they were able to join the game room successfully.
  - From here the user is currently waiting for the game host to start the game.
  - Once the host starts the game, the `GAME_STARTING` event is emitted to all players in the game room.
    - If the host unexpectedly disconnects from a game, the players are redirected to the join page
  - The `TUTORIAL_PROGRESS` event is emitted to all players for each step in the selected game mode's tutorial.
  - The `GAME_TIMER_SET` event is emitted to all players in the game room after the tutorial is complete
    - A future timestamp is sent with this event to the client; the client will manage the timer. This saves server resources.
  - The players will continue to recieve and send back events and data based on the game mode they are playing.
  - Once the game concludes, the `GAME_OVER` event will be emitted to all players in the game room.
  - All players will then be redirected to the leaderboard or end game screen.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🧹 Code Formatting and Structure

- The layout and design of the frontend and backend is adapted from CLEAN architecture priciples. These design priciples seperate the presentation layer, logic layer, model layer, and database layer.

- Code and Variable Formatting **[ In Progress ]**
  - General variables and function arguments use camel case.
    - Example: `helloWorld`.
  - All constants, config or environment variables use snake case with all uppercase letters.
    - Example: `HELLO_WORLD`.
  - Object, map or JSON keys use snake case with all lowercase letters.
    - Example: `hello_world`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🚧 Future Roadmap

- [ ] Add account system for customization and security.
- [ ] Improve spam protection.
- [ ] Use Mongo for saving game state instead of memory.
- [ ] Text and voice chat.
- [ ] Design improvements.
- [ ] Different game-modes.

See the [open issues](https://github.com/TheLawlessDev/Wordverse/issues) for a full list of proposed features as well as known issues.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## License

Distributed under the GNU Affero General Public License v3.0. See `LICENSE` or https://choosealicense.com/licenses/agpl-3.0/ for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🪙 Acknowledgments

- [Markdown Badges](https://github.com/Ileriayo/markdown-badges)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
