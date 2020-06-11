# radioreference

This will allow you to collect info about radio frequencies in a specfic zipcode from [radioreference](https://www.radioreference.com/).

You can use it on the web, [here](https://sdrtouch.dkonsumer.now.sh)

These are also available as standalone programs, in [releases](https://github.com/konsumer/radioreference/releases), so you don't need to install anything (not even node).

## TODO

* handle trunked systemns (eg [this](https://www.radioreference.com/apps/db/?sid=6830))

### Install

```sh
npm i radioreference
```

### Usage

```js
const { radioreference } = require('radioreference')

async function mine(){
  const portlandRadio = await radioreference(97239)
  console.log(portlandRadio)
}
```

There are also `gqrx` and `sdrtouch` fucntions exported from `radioreference`, that both take the data-object as input and output the format of bookmarks for each program.

These are also available as CLI programs:

```sh
git clone git@github.com:konsumer/radioreference.git
cd radioreference
npm i

# create bookmark file for Gqrx
./bin/gqrx 97239 > ~/.config/gqrx/bookmarks.csv

# create presets for sdrtouch
./bin/sdrtouch 97239 > SDRTouchPresets.xml
```