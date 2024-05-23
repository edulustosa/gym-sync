# GymSync

GymSync is an API designed to facilitate interaction between users and gyms, providing an integrated and efficient experience for check-ins and fitness activity management.

## Prerequisites

- Latest version of Node.js and npm.
- Docker 🐳

You can install Node and npm [here](https://nodejs.org/en/download/package-manager). \
You can install Docker [here](https://docs.docker.com/get-docker/).

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/edulustosa/gym-sync.git
    ```

2. Install the dependencies:

    ```bash
    cd gym-sync
    npm install
    ```

3. Configure the environment variables:

    Rename the file `.env.example` to `.env` and update the environment variables as necessary.

4. Start the database with Docker:

    ```bash
    sudo docker compose up -d
    ```

5. Run migrations:

    ```bash
    npx prisma migrate dev
    ```

6. Start the server:

    ```bash
    npm run dev
    ```

## 📫 Contributing to GymSync

To contribute to GymSync, follow these steps:

1. Fork this repository.
2. Create a branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`.
4. Push to your branch: `git push origin <branch_name>`.
5. Create a pull request.

Alternatively, refer to the GitHub documentation on [how to create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request).
