# Infinisoft Command Line Interface
CLI tool for easier process automation.

## Getting Started
Application is completely bootstraped by `@infini-soft/cli` and ready to implement.

```bash
$ cli [command]
```

## Commands

### Create
Create a new micro app from template

```bash
$ cli create
```

### Show paths
Output path to console for diagnostic

```bash
$ cli showPaths
```

### Generate OpenAPI 3.0.1 Schema
Output CRUD OpenAPI 3.0.1 JSON Schema

```bash
$ cli generateSchema
```

### Resolve JSON Schema Reference (Web URL Only)
Output resolved Schema

```bash
$ cli resolveSchema [schema URL] [REST resource name] [output file]
```
