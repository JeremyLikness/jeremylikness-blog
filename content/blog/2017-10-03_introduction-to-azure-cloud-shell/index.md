---
title: "Introduction to Azure Cloud Shell"
author: "Jeremy Likness"
date: 2017-10-03T15:59:39.976Z
years: "2017"
lastmod: 2019-06-13T10:44:04-07:00
comments: true
toc: true

description: "Learn about Azure Cloud Shell, a workstation you can access from any browser in the Azure portal. It attaches to a pre-configured workstation that has several tools and utilities already installed."

subtitle: "Learn how to access your fully configured Linux workstation from any browser to manage Azure resources and more."
tags:
 - Docker 
 - Azure 
 - Cloud Computing 
 - Linux 
 - Azure Cli 

image: "/blog/2017-10-03_introduction-to-azure-cloud-shell/images/2.png" 
images:
 - "/blog/2017-10-03_introduction-to-azure-cloud-shell/images/1.png" 
 - "/blog/2017-10-03_introduction-to-azure-cloud-shell/images/2.png" 
 - "/blog/2017-10-03_introduction-to-azure-cloud-shell/images/3.png" 
 - "/blog/2017-10-03_introduction-to-azure-cloud-shell/images/4.png" 
 - "/blog/2017-10-03_introduction-to-azure-cloud-shell/images/5.png" 
 - "/blog/2017-10-03_introduction-to-azure-cloud-shell/images/6.gif" 


aliases:
    - "/introduction-to-azure-cloud-shell-c88a37ff5c28"
---

Today I want to share a powerful tool that is built right into your web browser. [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=cloudshell&WT.mc_id=cloudshell-blog-jeliknes) is a shell you can access from the Azure portal. It attaches to a pre-configured workstation that has several tools and utilities already installed. It automatically authenticates to Azure so you are able to access your resources immediately, and can connect to a storage account to persist files between sessions.

The main advantage to using Azure Cloud Shell is the built-in access to the [Azure Command Line Interface (CLI)](https://docs.microsoft.com/en-us/cli/azure/?utm_source=jeliknes&utm_medium=blog&utm_campaign=cloudshell&WT.mc_id=cloudshell-blog-jeliknes) without having to install anything locally on your machine or create a custom Virtual Machine (VM). This tool makes it incredibly easy to create and manage Azure resources. Although you can do most things through the portal UI, many developers find that the CLI is a fast and easy way to accomplish tasks with minimal keystrokes.

## Getting Started

Access the Azure Cloud Shell by clicking on its icon at the top of your portal.

![Cloud Shell Icon](/blog/2017-10-03_introduction-to-azure-cloud-shell/images/1.png)
<figcaption>Cloud Shell Icon</figcaption>

Or, you can launch it directly from ☁🐚 [this link](https://shell.azure.com/).

This will open a pane on the web page to host the shell. The first time you access the shell, you will be prompted to connect to a storage account. This storage account not only allows you to save files and information between sessions, but also will enable you to upload files to access from the cloud shell. Follow the prompts to set up storage, then wait for the cloud shell to start:

![Cloud Shell is Ready](/blog/2017-10-03_introduction-to-azure-cloud-shell/images/2.png)
<figcaption>Cloud Shell is Ready</figcaption>

Now you are ready to issue commands. If you start with `az` you will see a list of all of the commands that are possible from the CLI. First, make certain you are working from the right subscription. To see a list of your Azure subscriptions, type:

`az account list --output table`

This produces a list of subscriptions (you may only have one) and indicates which one is set as the default (I added the yellow highlight in this example).

![List of Subscriptions with Default Highlighted](/blog/2017-10-03_introduction-to-azure-cloud-shell/images/3.png)
<figcaption>List of Subscriptions with Default Highlighted</figcaption>

If you need to change the subscription, use the `account set` command. You can pass it the subscription name or the subscription id:

`az account set --subscription=mysubscription`

You may then re-list the subscriptions to confirm.

## Resource Groups

[Resource groups](https://docs.microsoft.com/en-us/azure/azure-resource-manager/management/overview?utm_source=jeliknes&utm_medium=blog&utm_campaign=cloudshell&WT.mc_id=cloudshell-blog-jeliknes) are logical partitions that you can think of as folders for related assets in Azure. Similar resources are typically grouped in the same resource group. You can deploy and destroy all of the assets in a resource group at once. You can also track cost by resource group.

List your resources by issuing the command:

`az group list --o table`

Next, create a new resource group. If you choose a different name, be sure to update it in the next step.

`az group create --name container-group --location westus`

You should see a result that, if the group creation was successful, contains this entry:

`"provisioningState": "Succeeded"`

> **Tip: Getting help in the Azure CLI**. To get help in the CLI, simply add `--help` to any request. You can iterate through to more complex commands to get help for options. For example, to learn about resource groups you can issue the command `az group --help` to see what commands are available, then `az group list --help` to learn how the `list` command works.

I made this short video to demonstrate these steps in action.

{{<youtube LtQ_ktFDTTY>}}
<figcaption>Video: Introduction to Azure Cloud Shell</figcaption>

## Run a Container

For the last step we’ll do something much more interesting than creating groups: we’ll run a Docker container. We’ll use the powerful new service named [Azure Container Instances](https://docs.microsoft.com/en-us/azure/container-instances/?utm_source=jeliknes&utm_medium=blog&utm_campaign=cloudshell&WT.mc_id=cloudshell-blog-jeliknes) to accomplish this feat. Type the following command and hit enter (remember to update the resource group name if you changed it in the previous step).

`az container create --name gosmall --image jlikness/gosmall --ip-address public -g container-group`

This creates a container from the [public Docker image](https://hub.docker.com/r/jlikness/gosmall/) I have for a tiny web server that simply outputs the text `var id = <somenumber>;`. After the container is created, you receive a status message that provides the public IP address that was provisioned:

![The Public IP Address of an Azure Container Instance](/blog/2017-10-03_introduction-to-azure-cloud-shell/images/4.png)
<figcaption>The Public IP Address of an Azure Container Instance</figcaption>

You can type the IP address in your browser to access it, or use the curl command from the shell, like this (the number it returns for you is random and probably _not_ 606503):

![Curl Command for HTTP Request](/blog/2017-10-03_introduction-to-azure-cloud-shell/images/5.png)
<figcaption>Curl Command for HTTP Request</figcaption>

Be sure to clean up when you’re done. You can delete most assets by specifying the name and the resource group, like this:

`az container delete --name gosmall -g container-group`

Another way is to delete the resource group, which will delete all related assets, including any ACI containers.

`az group delete --name container-group`

Make sure you truly want to delete everything inside the resource group before you confirm!

## Conclusion

Today you learned how to access a powerful workstation that is accessible from any browser. Did you know the Azure Cloud Shell is even available from your phone when you install the [Azure mobile app](https://azure.microsoft.com/en-us/features/azure-portal/mobile-app/?utm_source=jeliknes&utm_medium=blog&utm_campaign=cloudshell&WT.mc_id=cloudshell-blog-jeliknes)? Use the shell to quickly list, create, and manage resources without having to set up an environment or install any software of your own. What will the shell enable you to do next in the cloud?

![Jeremy Likness](/blog/2017-10-03_introduction-to-azure-cloud-shell/images/6.gif)
