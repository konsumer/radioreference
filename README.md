# radioreference

This will allow you to collect info about radio frequencies in a specfic zipcode from [radioreference](https://www.radioreference.com/).


### Install

```sh
npm i radioreference
```

### Usage

```js
const radioreference = require('radioreference')

async function mine(){
  const portlandRadio = await radioreference(97239)
  console.log(portlandRadio)
}
```