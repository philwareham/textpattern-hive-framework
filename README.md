# Hive website theme framework for Textpattern CMS

[![Build Status](https://travis-ci.org/philwareham/textpattern-hive-framework.svg)](https://travis-ci.org/philwareham/textpattern-hive-framework)

A collection of Textpattern CMS website theme modules using [Hive Framework](https://github.com/philwareham/hive-framework) as a scaffold.

## Supported web browsers

* Chrome, Edge, Firefox, Safari and Opera the last two recent stable releases.
* Firefox ESR latest major point release.

Older versions of the above and other browsers may work, but these are the ones we verify.

## Image categories

For some of the images modules, you will need to create image categories within Textpattern and assign to the images you want to appear in the module. As follows:

1. `gallery` category, for images that are to appear in `gallery--xxx` image modules types.
2. `logo-wall` category, for images that are to appear in `logo-wall--xxx` image modules types.

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

To create a file download snippet:

    <txp::media_file category="" filename="" primary-button="" large-button="" />

`category` and `filename` are interchangeable (use one or the other, where appropriate) - if both are provided then `category` is used in preference and `filename` is ignored.

`primary-button` is optional. If set to `1`, this will render a more prominent button.

`large-button` is optional. If set to `1`, this will render a larger style button.

For example:

    <txp::media_file category="current-release-zip" primary-button="1" large-button="1" />

## License

Textpattern templates licensed under GPLv2 license. Hive Framework licensed under MIT license.
