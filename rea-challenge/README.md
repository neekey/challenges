# Property List

A simple property list management app.

- use webpack to implement ES6/SASS Compile
- use [mocha-webpack](https://github.com/zinserjan/mocha-webpack) to do the test, mocha with webpack

### Modules

- `src/data`: this is the module which handles all the data used for UI rending.
- `src/ui.property`: this is the component for rendering a single property, it also handles "add" and "remove" events
- `src/ui.property_list`: this is the component for rendering a list of properties; it uses ui.property as its child component

the data flow is quite simple, it's just a one way direction:

```
data -> ui.property_list -> ui.property
```

And all the UI components do not know how to handle data; they only know about handle user event.

So when UI Event happens, the UI Components will just throw out the event, and let it to anyone who interests, and they don't re-render themselves only data change.:

```
user-interact -> ui.property -> ui.property_list --> data handle the action, update its data

```

### Usage

You should be able just open file `build/index.html` directly, or you can start development mode, and open `http://localhost:8080`.

#### install dependencies

```
npm install
```

#### build

```
npm run build
```

#### development.

```
npm run dev
```

#### test

```
npm run test
```

