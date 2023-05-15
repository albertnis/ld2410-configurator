# LD2410 configurator

Display radar data and configure your LD2410 motion sensor, right from the browser! The aim of this project is to improve on the hard-to-use Windows-only tooling provided by HiLink.

Features:

- Easy to use without any coding
- Cross platform
- Only software dependency is a supported browser
- Compatible with LD2410B and LD2410C

## Usage and compatibility

LD2410 configurator will soon be hosted online and can be used from any browser that supports the [WebSerial API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API) (Chrome, Edge or Opera as at time of writing). When the site is deployed, usage will look something like this:

1. Plug your LD2410 into your computer via a serial-to-USB adapter such as CP2102.
1. Browse to the site and follow the instructions.

In the mean time you will need to clone, install and run it locally using the instructions below.

## Develop

```bash
npm install
```

```bash
npm run dev -- --open
```

## Build

```bash
npm run build
```
