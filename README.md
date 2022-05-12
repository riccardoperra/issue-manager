# IssueManager
> An issue board manager made with Angular and AppWrite

## 🎯 About

*IssueManager* is an application built with Angular 14 and AppWrite
for the [AppWrite Hackathon](https://dev.to/devteam/announcing-the-appwrite-hackathon-on-dev-1oc0).

It's a small project management tool inspired by GitHub Projects,
leveraging of some AppWrite features such as `Realtime database` and `Functions`.

## Features

### Authentication

IssueMaanger authentication system is entirely based on Appwrite, and currently supports login and registration via Email/Password, Google and Github.

![issue-manager-demo vercel app_login (2)](https://user-images.githubusercontent.com/37072694/168169039-74bb5278-e7ff-426b-9d05-a3bfd28a3003.png)
![issue-manager-demo vercel app_login (1)](https://user-images.githubusercontent.com/37072694/168169013-bc1e6fb6-36be-43d9-babf-871c8c437aa8.png)

### Create a new project

Each authenticated user has the possibility to create a new project to IssueManager. A project is a kanban board where you can track your tasks.

Creating a project involves a series of processes to create the user's workspace, in fact thanks to an [Appwrite `function`](./functions/create-project) that will first craete a new [Appwrite Team](https://appwrite.io/docs/client/teams) where the user which has created the project is the owner, next it will create a new [Appwrite Storage Bucket](https://appwrite.io/docs/client/storage) where users can upload their files, then it will finally creates the `Project` entity to the database.

A project can be either public or private. When creating a public project, every user is able to view it even if it cannot update it. Private projects, on the other hand, can only be seen and updated by team members.

https://user-images.githubusercontent.com/37072694/168170705-bf94db01-72a2-46c0-8351-fd71944442e7.mp4


## 🚀 Technologies

The frontend is built with Angular 14 using entirely the new **Standalone Component** feature. 

It also includes [RxAngular](https://github.com/rx-angular/rx-angular), a toolset focused on runtime performance and template rendering,
and [taiga-ui](https://github.com/Tinkoff/taiga-ui), an awesome UI component library.
