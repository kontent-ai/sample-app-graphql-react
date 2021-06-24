# Kontent Sample app GraphQL React

## Getting started

In this section you can find how to get the application ready in development mode.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (LTS recommended)

### Run site in development

In the project directory, install all dependencies.

```sh
npm install
```

### (Optional) Create your own data source project in Kontent

This optional section allows you to create your own copy of the project in Kontent so that you can make changes. If you skip this step, the application is connected to the published data of a shared project that is read-only via API for you.

#### Create Kontent project

1. Create an account on Kontent
   - [Create an account on Kontent.ai](https://app.kontent.ai/sign-up?utm_source=nextjs_boilerplate_example&utm_medium=devrel).
2. After signing up, [create an empty project](https://docs.kontent.ai/tutorials/set-up-kontent/projects/manage-projects#a-creating-projects).
3. Go to the "Project Settings", select API keys and copy the following keys for further reference
   - Project ID
   - Management API key
4. Use the [Template Manager UI](https://kentico.github.io/kontent-template-manager/import) for importing the content from [`kontent-backup.zip`](./kontent-backup.zip) file and API keys from the previous step. Check _Publish language variants after import_ option before import.

   > Alternatively, you can use the [Kontent Backup Manager](https://github.com/Kentico/kontent-backup-manager-js) and import data to the newly created project from [`kontent-backup.zip`](./kontent-backup.zip) file via command line:
   >
   > ```sh
   >  npm i -g @kentico/kontent-backup-manager
   >  # or
   >  yarn global add @kentico/kontent-backup-manager
   >
   >  kbm --action=restore --projectId=<Project ID> --apiKey=<Management API key> --zipFilename=kontent-backup
   > ```
   >
   > Go to your Kontent project and [publish the imported items](https://docs.kontent.ai/tutorials/write-and-collaborate/publish-your-work/publish-content-items).

#### Environment variables

1. Set up environment variables

   - Copy the `.env.template` file in this directory to `.env` (which will be ignored by Git):

     ```sh
     cp .env.template .env
     ```

1. Run the development server

   ```sh
   npm run start
   ```

🎉 Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

> By default, the content is loaded from a shared Kentico Kontent project. If you want to use your own clone of the project so that you can customize it and experiment with Kontent, continue to the next section.

|              Variable              | Required | Description                                                                                     |
| :--------------------------------: | :------: | :---------------------------------------------------------------------------------------------- |
|    REACT_APP_KONTENT_PROJECT_ID    |    NO    | Project identification                                                                          |
| REACT_APP_KONTENT_GRAPHQL_ENDPOINT |    NO    | Kontent GraphQL endpoint                                                                        |
| REACT_APP_KONTENT_PREVIEW_API_KEY  |    NO    | Project key allowing to load non-published content described in the [Preview](#preview) section |

## Content editing development

Run the development server:

```sh
npm start
```

🎉 Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying content in Kentico Kontent project. The page auto-updates as you edit the content. If you don't have `KONTENT_PREVIEW_API_KEY` specified, you need to [publish the changes](https://docs.kontent.ai/tutorials/write-and-collaborate/publish-your-work/publish-content-items) in order to see the changes on site.

### Available Scripts

- `npm start` - Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- `npm test` - Launches the test runner in the interactive watch mode. See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
- `npm build` - Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
- `npm eject` - **Note: this is a one-way operation. Once you `eject`, you can’t go back!** If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

## About

This section describes the content model of the site and the use cases that are supposed to demonstrate GraphQL capabilities.

### Content Model

The site is using a simple layout. A header with a Logo and a menu.
Depending on the type of the "Content" you can have one of the layouts:

- Landing page - List of various sections displayed as rows.
- Listing page - A grid of homogenous content pieces - specifically articles in the sample.
- Simple page - A simple page rendering the title, subtitle, image, and rich text element.

![Page types](./docs/Next.js%20site%20layout.png)

## Layout - global/shared data

### Menu

### Sitemap construction



## Simple page

Rich tex resolution + formatted text

### Components

### Inline linked items

### Links

### Assets

### Image transformation (hero image)

## Landing page

### Sections of the landing page linked items resolution

Landing page - use components instead of linked items
Projection per type

## Listing page

### Paging

### Listing - detail

### Filtering

#### Filter blogs by author

#### Filter blog by persona

---

## Preview

## Learn More

> This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
