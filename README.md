# `Infinicloud`

> ERP Solutions

## Usage

### Pull backend
amplify pull --appId da5y0y4h8nk9s --envName mart

### Storage 
https://s3.console.aws.amazon.com/s3/buckets/infinicloudstorage215423-mart?region=us-east-1&tab=objects
arn:aws:s3:::infinicloudstorage215423-mart

### Start local
Start solution locally

```
lerna run start

```


### Kitchensink
Shared components with documentation

```
lerna run start:kitchen

```

## Packages

### Container
Container app responsible for layout, authentication and module federation.

- packages/container

### Tenant Manager
Micro app for tenant management

- packages/tenantmanager

Backend App
https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/da5y0y4h8nk9s

### Config
Shared config

- packages/config

### Utils
Utility package

- packages/utils

#### Sorters

Bubble sort helper
- bubble 
