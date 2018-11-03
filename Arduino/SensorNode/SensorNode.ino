#include <WiFi.h>
#include <ESPmDNS.h>
#include <WiFiUdp.h>
#include <ArduinoOTA.h>
#include <WebSocketServer.h>

const char* ssid = "Zeus";
const char* password = "Sq8gnb54";

const int trigPin = 13;
const int echoPin = 12;

WiFiServer server(1337);
WebSocketServer webSocketServer;

void setup() {
  Serial.begin(115200);
  Serial.println("Booting");
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.waitForConnectResult() != WL_CONNECTED) {
    Serial.println("Connection Failed! Rebooting...");
    delay(5000);
    ESP.restart();
  }

  ArduinoOTA.onStart([]() {
    String type;
      if (ArduinoOTA.getCommand() == U_FLASH) {
        type = "sketch";
      } else { // U_SPIFFS
        type = "filesystem";
      }
      Serial.println("Start updating " + type);
    })
    .onEnd([]() {
      Serial.println("\nEnd");
    })
    .onProgress([](unsigned int progress, unsigned int total) {
      Serial.printf("Progress: %u%%\r", (progress / (total / 100)));
    })
    .onError([](ota_error_t error) {
      Serial.printf("Error[%u]: ", error);
      if (error == OTA_AUTH_ERROR) Serial.println("Auth Failed");
      else if (error == OTA_BEGIN_ERROR) Serial.println("Begin Failed");
      else if (error == OTA_CONNECT_ERROR) Serial.println("Connect Failed");
      else if (error == OTA_RECEIVE_ERROR) Serial.println("Receive Failed");
      else if (error == OTA_END_ERROR) Serial.println("End Failed");
    });

  ArduinoOTA.begin();

  Serial.println("Ready");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  pinMode(trigPin, OUTPUT); // Sets the trigPin as an Output
  pinMode(echoPin, INPUT); // Sets the echoPin as an Input
}

void loop() {
  ArduinoOTA.handle();

  Serial.println("Starting the server");
  server.begin();
  delay(100);

  Serial.println("server running, waiting for client.");
  while(true)
  {
    WiFiClient client = server.available();
    
    if (client.connected() && webSocketServer.handshake(client)) 
    {
      Serial.println("");
      Serial.println("client connected");
      while (client.connected()) 
      {
        float distance = getDistance();
        webSocketServer.sendData(String(distance));
        Serial.println(distance);
        delay(10); // Delay needed for sending the data correctly
        delay(100);
      }
      Serial.println("The client disconnected, waiting for new client.");
      delay(100);
    }
    else
    { 
      Serial.print(".");
    }
    
    delay(100);
  }
}


float getDistance() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  // Sets the trigPin on HIGH state for 10 micro seconds
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  // Reads the echoPin, returns the sound wave travel time in microseconds
  int duration = pulseIn(echoPin, HIGH, 10000);
  // Calculating the distance
  float distance = (duration/2) / 29.1;
  return distance;
}
