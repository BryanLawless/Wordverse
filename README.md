<a name="readme-top"></a>

<div align="center">
	<h2>Wordverse</h2>
	<h3>FBLA Game Development 2022-2023</h3>
	Bryan Lawless & Jack Houchin
</div>

<br>

## 📜 Summary

Wordverse is a multiplayer platform where users can create and join rooms to play a variety of competitive word games. We chose to use web technologies instead of platforms like Unity or other game frameworks. This allows users to play the game without any reqiuired download. It also opens the door for cross platform mobile and desktop applications down the road.

<br>

## 🧰 Core Technologies Used

| Technology                                                                                                        | Description                               | Link                     |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------ |
| ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)           | Runtime environment for JavaScript        | https://nodejs.org/en/   |
| ![Vue.js](https://img.shields.io/badge/vuejs-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D) | Frontend JavaScript framework.            | https://vuejs.org/       |
| ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)            | Frontend module and asset bundler.        | https://vitejs.dev/      |
| ![Socket.io](https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101)   | Library for bi-directional communication. | https://socket.io/       |
| ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)   | Database and storage solution.            | https://www.mongodb.com/ |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🔧 Installation

### Prerequisites

- NodeJS 16+

1. Clone the repo: `https://github.com/TheLawlessDev/Words-Hurt`
2. Navigate inside the cloned folder.
3. Open your command line and run the following commands:
   - `npm run install-all`
     - This will install frontend and backend dependecies.
   - `npm run build-client`
     - This will bundle the frontend for production.
   - `npm run start`
     - This will start the entire project.
4. The project will be running on `127.0.0.1:5000` by default.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🧹 Code Formatting and Structure

- The layout and design of the frontend and backend is adapted from CLEAN archutecture priciples. These design priciples seperate the presentation layer, logic layer, model layer, and database layer.
- Code and Variable Formatting **[ In Progress ]**
  - General variables and function arguments use camel case. `Example: helloWorld`
  - All constants, config or environment variables use snake case with all uppercase letters. `Example: HELLO_WORLD`
  - Object, map or JSON keys use snake case with all lowercase letters. `Example: hello_world`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<br>

## 🚧 Future Roadmap

- [ ] Add account system for customization and security.
- [ ] Improve spam protection.
- [ ] Use Mongo for saving game state instead of memory.
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
