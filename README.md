# 📆 react-hours

`react-hours` is an OpenStreetMap [`opening_hours`](https://wiki.openstreetmap.org/wiki/Key:opening_hours) specification compatible editor with a calendar frontend.

## Installation

Using `yarn`:

```bash
yarn add react-hours
```

Using `npm`:

```bash
npm install react-hours
```

## Basic example

A very simple example that renders the editor:

```javascript
import Hours from "react-hours";
import ReactDOM from "react-dom";

ReactDOM.render(<Hours />, document.body);
```

An `onChange` callback can also be specified, which is called every time something was changed in the editor:

```javascript
import Hours from "react-hours";
import ReactDOM from "react-dom";

ReactDOM.render(
	<Hours
		onChange={(osmString) => {
			console.log(osmString);
		}}
	/>,
	document.body
);
```

In addition, a string in the `opening_hours` specification can also be passed through as an initial value:

```javascript
import Hours from "react-hours";
import ReactDOM from "react-dom";

ReactDOM.render(<Hours value="We 11:00-12:00" />, document.body);
```

## Specification

All properties are **optional**.

| Property | Type                    | Default Value                                                                              |
| -------- | ----------------------- | ------------------------------------------------------------------------------------------ |
| value    | string                  | Initial value in the `opening_hours` specification                                         |
| onChange | Function(value: string) | Function which is called whenever something is changed in the editor                       |
| theme    | string                  | Calendar theme (see [here](https://fullcalendar.io/docs/themeSystem) for more information) |
| locale   | string                  | Language of the calendar                                                                   |

## License

Copyright 2021 Marvin Schopf

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
