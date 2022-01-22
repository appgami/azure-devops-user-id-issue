# User ID POC

The goal of this POC is to verify that, for certain combinations of users and Azure DevOps instances, the ID returned by the platform APIs is different than the ID present in the user's app token. This behaviour seems to be random and causes issues when using the app token for authorization checks on the backend of Azure DevOps extensions.

## Running the test

This is an Azure DevOps extension. Thus, firstly it is necessary to install the extension and then run locally the server to serve the static assets.

### Configuring the environment

Please edit the following files that will allow the extension to be published to your Azure DevOps marketplace vendor profile:

- `/azure/.azuredevops-instance`: the file content should contain only the ID of your vendor profile e.g. `appgami`
- `/azure/.azuredevops-token`: the file content should contain only the token that will be used to publish the extension to your vendor profile. This token can be generated from your vendor profile page.

If the files above do not exist, then create them in the directory indicated above.

### Installing the extension

To build and install the extension in your Azure DevOps marketplace profile, please run the following commands:

```
yarn install
yarn build
yarn azure:package
yarn azure:publish
```

### Starting the application

To start the application, please run:

```
yarn start
```

Then, head to your Azure Devops instance, navigate to a project and find the menu item "User ID POC" under the "Boards" section:

![Menu item][menuitem]

[menuitem]: menu-item.png
