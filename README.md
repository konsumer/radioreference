# radioreference

This will allow you to collect info about radio frequencies in a specfic zipcode from [radioreference](https://www.radioreference.com/).

## Install

```sh
npm i radioreference
```

## Usage

```js
import radioreference from 'radioreference'

const pdx = await radioreference(97239)
console.log(pdx)
```

## TODO

- pre-made converters for popular preset formats (chirp, sdrtouch, hackrf)
- handle trunked systems (eg [this](https://www.radioreference.com/apps/db/?sid=6830))
- handle ham: (eg [this](https://www.radioreference.com/db/ham/search/?zip=97239)
- handle metro (eg [this](https://www.radioreference.com/db/browse/mid/44))
- handle state (eg [this](https://www.radioreference.com/db/browse/stid/41))
