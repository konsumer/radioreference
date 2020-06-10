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

I also included some tools to convert to different SDR preset-formats:

```sh
git clone git@github.com:konsumer/radioreference.git
cd radioreference
npm i

# create bookmark file for Gqrx
./gqrx 97239 > ~/.config/gqrx/bookmarks.csv

# create presets for sdrtouch
./sdrtouch 97239 > SDRTouchPresets.xml
```

These are also available as standalone programs, in [releases](https://github.com/konsumer/radioreference/releases)