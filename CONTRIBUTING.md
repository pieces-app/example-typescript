# Pieces Open Source Contributor Guidelines

We are beyond excited that you want to contribute! We would love to accept your contributions. Pieces Open Source is built for the community and warmly welcomes collaboration. There are many ways in which one could contribute to Pieces Open Source, and every contribution is equally appreciated here. Navigate through the following to understand more about contributing.

## General Contribution Flow

### Contributing Guidelines

Firstly, thank you for considering contributing to Pieces Open Source. This guide details the general information that one should know before contributing to the repository.
Please stick as closely as possible to the guidelines. That way, we ensure that you have a smooth experience contributing to this project.

If you are a designer - [start here to get more specific information](#contributing-design).

### General Rules:

These are, in general, rules that you should be following while contributing to an Open-Source Pieces project:

- Be Nice, Be Respectful (BNBR)
- Check if the Issue you created already exists or not
- When creating a new issue, make sure you describe the issue clearly
- Use tags to mark your issue as “draft” (we will remove the draft tag once we assign the proper issue tags to the created issue)
- Make proper commit messages and document your PR well
- Always add comments to your code
- Follow proper code conventions because writing clean code is important
- Add @jordan-pieces as a reviewer to be assigned to another maintainer or to be reviewed
- Issues will be assigned on a "First Come, First Served" basis
- Once an issue has been assigned, if we don’t receive any reply/response in a week, we will reassign the issue to someone else and remove the assignee
- Do mention (@jordan-pieces) the project maintainer if your PR isn't reviewed within three days

## Getting Started

### Pre-requisites

1. Ensure you have the latest version of Pieces OS installed on your system:
   - [Windows](https://docs.pieces.app/installation-getting-started/windows)
   - [macOS](https://docs.pieces.app/installation-getting-started/macos)
   - [Linux](https://docs.pieces.app/installation-getting-started/linux)

2. Ensure that you have [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.

### Pull Request

**1.** Fork the [repository](https://github.com/pieces-app/example-typescript) on GitHub.

**2.** Clone the forked repository. Open up the GitBash/Command Line and type:

```bash
git clone https://github.com/<YOUR_USER_NAME>/<FORKED_REPO_NAME>.git
```

**3.** Navigate to the project directory:

```bash
cd <FORKED_REPO_NAME>
```

**4.** Add a reference to the original repository:

```bash
git remote add upstream https://github.com/pieces-app/example-typescript.git
```

**5.** See the latest changes to the repo using:

```bash
git remote -v
```

**6.** Create a new branch:

```bash
git checkout -b <YOUR_BRANCH_NAME>
```

**7.** Always take a pull from the upstream repository to your main branch to keep it even with the main project. This will save you from frequent merge conflicts:

```bash
git pull upstream main
```

**8.** You can make the required changes now. Make appropriate commits with proper commit messages.

**9.** Add and then commit your changes:

```bash
git add . && git commit -m "YOUR_COMMIT_MESSAGE"
```

**10.** Push your local branch to the remote repository:

```bash
git push -u origin <YOUR_BRANCH_NAME>
```

**11.** Once you have pushed the changes to your repository, go to your forked repository. Click on the `Compare & pull request` button.

**12.** Give a proper title to your PR and describe the changes you made in the description box. (Note: Sometimes there are PR templates that are to be filled in as instructed.)


**13.** Open a pull request by clicking the `Create pull request` button.

`Voila, you have made your first contribution to this project`

## Issue

**Issues can be used to keep track of bugs, enhancements, or other requests. Creating an issue to let the project maintainers know about the changes you are planning to make before raising a PR is a good open-source practice.**
<br>

Let's walk through the steps to create an issue:

**1.** On GitHub, navigate to the main page of the repository. [Here](https://github.com/.git) in this case.

**2.** Under your repository name, click on the `Issues` button.

**3.** Click on the `New issue` button.

**4.** Select one of the Issue Templates to get started.

**5.** Fill in the appropriate `Title` and `Issue description` and click on `Submit new issue`.

## Contributing Design

We also have opportunities to contribute to our projects as a designer and to submit your design mockups kindly upload them as PDFs to the `/drafts` directory. Follow along with the below guide to get started:

Your creativity is truly appreciated! We have set up some simple folders where you can upload drafts and design files for review, and usage during development.

Check out these steps for uploading a **pdf export** into the `/mockups` folder:

1. Export your file from your design software as a .PDF file
2. After you have followed the above steps to fork the repo and download the project, open up the `/mockups` folder and locate either draft or final depending on your current status
3. Then save the PDF to one of the directories, and set the title in this pattern: 
   - [date]_[pagename]_[authorname].pdf
4. Then commit your changes to your local branch, push those change and open up a PR! From there you should be all good to go.

### Tutorials that may help you:

- [Git & GitHub Tutorial](https://www.youtube.com/watch?v=RGOj5yH7evk)
- [Resolve merge conflict](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/resolving-a-merge-conflict-on-github)

