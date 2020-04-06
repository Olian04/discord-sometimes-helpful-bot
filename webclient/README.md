# webclient

## Version 1 (MVP)

* View channel configs
* Edit channel configs
* Bot will generate a unique temporary transaction ID, and send it to the user in the form of a URL.
* The user will then have 5 minutes to make their changes before the transaction expires. While a transaction is open, no other transaction may open regarding the same asset.

## Version 2

* Edit existing events in a web GUI.
* Bot will create an event in the DB, and send a link to an Edit-Page to the user. When the user clicks the link they are brought to a website where they can edit the event.

### Edit-Page WIP

* See current ti

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
