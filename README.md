# Hive website theme framework for Textpattern CMS

[![Build Status](https://travis-ci.org/philwareham/textpattern-hive-framework.svg)](https://travis-ci.org/philwareham/textpattern-hive-framework)

A collection of Textpattern CMS website theme modules using [Hive Framework](https://github.com/philwareham/hive-framework) as a scaffold.

## Supported web browsers

* Chrome, Edge, Firefox, Safari and Opera the last two recent stable releases.
* Firefox ESR latest major point release.

Older versions of the above and other browsers may work, but these are the ones we verify.

## Shortcodes

Textpattern 4.7 introduced support for user-definable `<txp:output_form />` attributes (and also the short tags syntax `<txp::...>`), allowing for our own version of 'shortcodes' within articles (**note:** remember to also use `notextile.` when within Textile content). This site uses the following tags:

### Image

TBC

### Video

To create a HTML5 video snippet:

    <txp::media_video width="" height="" mp4-url="" webm-url="" poster-url="" name="" description="" duration-seconds=""/>

`poster-url`, `name`, `description` and `duration-seconds` are optional, but should be provided if possible to provide valid Schema.org microdata. If not used, remove those attributes from your shortcode.

For example:

    <txp::media_video width="640" height="480" mp4-url="/video/video1.mp4" webm-url="/video/video1.webm" poster-url="/video/video1-poster.png" name="Cat video" description="My great video of cats." duration-seconds="20" />

### File

TBC

## License

Textpattern templates licensed under GPLv2 license. Hive Framework licensed under MIT license.
