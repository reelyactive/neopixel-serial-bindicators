/**
 * Copyright reelyActive 2023
 * We believe in an open Internet of Things
 */


// Dependencies
#include <Adafruit_NeoPXL8.h>
#include <Adafruit_NeoPixel.h>


// Constants
#define NUM_LEDS 680
#define COLOR_ORDER NEO_GRB
#define LED_BRIGHTNESS 32
#define BAUD_RATE 9600
#define TERMINATOR_CHARACTER '\n'
#define MESSAGE_LENGTH 6


// Global variables
int8_t pins[8] = { 16, 17, 18, 19, 20, 21, 22, 23 }; // For SCORPIO pinout
Adafruit_NeoPXL8 leds(NUM_LEDS, pins, COLOR_ORDER);
Adafruit_NeoPixel status(1, 4, NEO_GRB + NEO_KHZ800);
byte message[MESSAGE_LENGTH];


// Run once on startup
void setup() {
  status.clear();          // Clear the onboard NeoPixel on startup
  delay(200);

  // Should initialisation fail, blink the onboard LED to indicate error.
  if(!leds.begin()) {
    pinMode(LED_BUILTIN, OUTPUT);
    for(;;) digitalWrite(LED_BUILTIN, (millis() / 500) & 1);
  }

  leds.setBrightness(LED_BRIGHTNESS);

  status.setPixelColor(0, status.Color(0x10, 0x10, 0x00));
  status.show();           // Onboard NeoPixel amber while waiting for serial
  delay(200);
  
  Serial.begin(BAUD_RATE); // Initialise serial over USB
  while(!Serial);          // Wait until serial over USB is ready
  Serial.println("SCORPIO ready");

  status.setPixelColor(0, status.Color(0x00, 0x20, 0x00));
  status.show();           // Onboard NeoPixel green when serial ready
}

// Run continuously
void loop() {
  handleSerialMessage();
}

// Handle a serial message with NeoPixel instructions
void handleSerialMessage() {
  if(Serial.available())
  {
    int messageLength = Serial.readBytesUntil(TERMINATOR_CHARACTER, message,
                                              MESSAGE_LENGTH);
    if(messageLength == MESSAGE_LENGTH) {
      uint16_t stripOffset = (message[1] * 256 + message[2]);
      switch(message[0]) {
        case 0x00: // Strip 0
        case 0x01: // Strip 1
        case 0x02: // Strip 2
        case 0x03: // Strip 3
        case 0x04: // Strip 4
        case 0x05: // Strip 5
        case 0x06: // Strip 6
        case 0x07: // Strip 7
          if(stripOffset < NUM_LEDS) {
            uint8_t matrixOffset = message[0] * NUM_LEDS;
            uint32_t color = leds.Color(message[3], message[4], message[5]);
            leds.setPixelColor(matrixOffset, color);
          }
          break;
        case 0xaa: // Show
          leds.show();
          break;
        case 0xff: // Clear
          leds.clear();
          break;
      }
    }
  }
}
