# IssueManager
> A kanban management tool made with Angular and AppWrite

### ⚠️ <strong>READ THIS</strong> 
This project is a demo, born mainly to test Appwrite integration with Angular experimental features, and <strong>it's not ready for production!</strong>
The site currently online is a test and will be discontinued soon. If you want to try the application, you need to get Appwrite and host the server yourself.

## 🎯 About

*IssueManager* is an application built with Angular 14 and AppWrite
for the [AppWrite Hackathon](https://dev.to/devteam/announcing-the-appwrite-hackathon-on-dev-1oc0).

It's a small kanabn management tool inspired by GitHub Projects,
leveraging of some AppWrite features such as [`Account`](https://appwrite.io/docs/account), [`Database`](https://appwrite.io/docs/database), [`Realtime`](https://appwrite.io/docs/realtime), [`Functions`](), [`Storage`](https://appwrite.io/docs/storage), [`Teams`](https://appwrite.io/docs/client/teams).

## 🚀 Technologies

The frontend is built with Angular 14 using entirely the new **Standalone Component** feature. https://github.com/angular/angular/discussions/43784

It also includes [RxAngular](https://github.com/rx-angular/rx-angular), a toolset focused on runtime performance and template rendering [taiga-ui](https://github.com/Tinkoff/taiga-ui), an UI component library.

WYSIWYG editor is built with [Lexical](https://github.com/facebook/lexical) from Meta and a small angular wrapper made by myself (the repo is currently private but available to [NPM](https://npmjs.com/lexical-angular)).

## 🌐 Demo 
A [live deployment](https://issue-manager-demo.vercel.app) of this app is available to try it out.

## ✅ Features

### Authentication

IssueManager authentication system is entirely based on Appwrite, and currently supports login and registration via Email/Password, Google and Github.

![issue-manager-demo vercel app_login (2)](https://user-images.githubusercontent.com/37072694/168169039-74bb5278-e7ff-426b-9d05-a3bfd28a3003.png)

### Creating a new project

Each authenticated user has the possibility to create a new project to IssueManager. A project is a kanban board where you can track your tasks.

Creating a project involves a series of processes to create the user's workspace, in fact thanks to an [Appwrite function](./functions/create-project) that will first craete a new [Appwrite Team](https://appwrite.io/docs/client/teams) where the user which has created the project is the owner, next it will create a new [Appwrite Storage Bucket](https://appwrite.io/docs/client/storage) where users can upload their files, then it will finally creates the `Project` entity to the database.

A project can be either public or private. When creating a public project, every user is able to view it even if it cannot update it. Private projects, on the other hand, can only be seen and updated by team members.

The Realtime functionalities are also used to update automatically the list of available projects in the case that the project is deleted or if his visibility changes, in order to notify all users

https://user-images.githubusercontent.com/37072694/168170705-bf94db01-72a2-46c0-8351-fd71944442e7.mp4

### Managing the board

After creating a new project, users can access the board and can start to manage their tasks. Thanks to Appwrite realtime, each user which is visiting the board at that time will have always the updated issues.

Users has the possibility to create, archive or re-order a new Category, then to create and move the Tasks inside just like a Kanban board. The ordering is made with [JIRA LexoRanks](https://medium.com/whisperarts/lexorank-what-are-they-and-how-to-use-them-for-efficient-list-sorting-a48fc4e7849f) in order to optimize the performance and database request.

https://user-images.githubusercontent.com/37072694/168174826-7c459f49-8793-4522-b1f8-5b2bb7e5fb02.mp4

### Adding new members to the board

Users that have the authorities to update the board can also invite new members and allow them to view all kanban progress. Once the user's e-mail in question has been entered, it will be sent to his mailbox and must be accepted to enable the user for the project.

![image](https://user-images.githubusercontent.com/37072694/168176124-bd5faf8c-c067-496a-95c8-b6c401102749.png)

### Viewing and updating tasks

Each created task of the kanban board can be readed and updated. Users can manage their task updating the expiration date, priority and also the description. The WYSIWYG is made with `Lexical` and `lexical-angular` (Angular binding for lexical, which is currently a private repo in development, but already available to [NPM](https://npmjs.com/lexical-angular). 

https://user-images.githubusercontent.com/37072694/168176690-3fa25104-ccd5-4d7e-bb95-a18abc79dfa2.mp4

### Adding attachments to tasks

Thanks to Appwrite Storage, the user has the possibility to manage the attachments of a task. Attachments consists of uploaded files that can be downloaded, deleted or viewed (if the preview is available). Each file (even multiple) can be uploaded through drag-and-drop or clicking to the custom file input provided by `taiga-ui`

https://user-images.githubusercontent.com/37072694/168177316-a007e76e-ca9c-4789-abb7-d51ce428f3f9.mp4

## 👨🏻‍💻 Run Locally
- Clone the project
  ```bash
  git clone https://github.com/riccardoperra/issue-manager
  ```
- Install dependencies
  ```bash
  yarn install
  ```
- Start the local server
  ```bash
  ng serve
  ```
  
### ⚠️ <strong>READ THIS</strong> 
To connect to Appwrite you have to follow their guides to install the instance
Appwrite Installation - https://appwrite.io/docs/installation
Appwrite Web SDK - https://appwrite.io/docs/getting-started-for-web
  

## License

MIT © [Riccardo Perra](https://github.com/riccardoperra)
