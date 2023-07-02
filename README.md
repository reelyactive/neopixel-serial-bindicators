neopixel-serial-bindicators
===========================

REST API to light up individual NeoPixels associated with a specific cart/shelf/bin via a serial link to a microcontroller.


Quick Start
-----------

Clone this repository, install package dependencies with `npm install`, and then from the root folder run at any time:

    npm start

__neopixel-serial-bindicators__ will attempt to connect with a microcontroller at 9600 baud on a serial/USB link, and accept requests to configure via API any LED strips connected to that microcontroller.


Microcontrollers
----------------

The following microcontrollers are supported, with code provided:

| Microcontroller (and shield)   | Code (in /microcontrollers folder) |
|:-------------------------------|:-----------------------------------|
| Arduino Nano with Grove shield | arduino-nano.ino                   |


REST API
--------

__neopixel-serial-bindicators__'s REST API includes the following base route:
- /bindicators _to indicate one or more bins with specific LED settings_

### PUT /bindicators

Update the strips to indicate one or more bins with specific LED settings.

#### Example request

| Method | Route        | Content-Type     |
|:-------|:-------------|:-----------------|
| PUT    | /bindicators | application/json |

    [
      { "cart": "A", "shelf": 1, "bin": 2, "rgb": "0770a2" },
      { "cart": "B", "shelf": 3, "bin": 1, "rgb": [ 7, 112, 162 ] }
    ]

#### Example response

    {
      "_meta": {
        "message": "ok",
        "statusCode": 200
      },
      "_links": {
        "self": {
          "href": "http://localhost:3001/bindicators/"
        }
      }
    }

#### Notes

To turn off all LEDs, PUT /bindicators with an empty array (`[]`).


Serial Protocol
---------------

__neopixel-serial-bindicators__ translates API requests into serial messages, according to the following protocol, which can easily be interpreted by resource-constrained microcontrollers and transformed into neopixel commands using existing libraries.

Each serial message is 6 bytes long, as specified in the following table, and terminated with a newline character ('\n').

| Byte offset | Description                                       |
|:------------|:--------------------------------------------------|
| 0           | Strip id (0 to 127) or special command (128-255)  |
| 1           | MSB of LED offset or strip id for special command |
| 2           | LSB of LED offset                                 |
| 3           | Red intensity (0 to 255)                          |
| 4           | Green intensity (0 to 255)                        |
| 5           | Blue intensity (0 to 255)                         |

The following special commands are supported:
- 0xaa: _display the current configuration_
- 0xff: _clear the current configuration_

For example, to clear strip 1 and make the first three LEDs red, green and blue, respectively, the serial message sequence, as hexadecimal strings, would be as follows:

    ff01000000000a
    000000ff00000a
    00000100ff000a
    0000020000ff0a
    aa01000000000a

The seventh byte in each message above is the newline character (0x0a).


License
-------

MIT License

Copyright (c) 2023 [reelyActive](https://www.reelyactive.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
THE SOFTWARE.
