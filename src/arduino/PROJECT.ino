#include <ESP8266WiFi.h>
#include <ArduinoJson.h>  //v6
#include <Arduino_JSON.h>
#include <SPI.h>
#include <MFRC522.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>
#include <WiFiUdp.h>

//RFID
#define RST_PIN D1
#define SS_PIN D2
MFRC522 mfrc522(SS_PIN, RST_PIN);
String rfid_in = "";

//Buzzer
const unsigned char Passive_buzzer = 15;

WiFiManager wifiManager;
WiFiUDP ntpUDP;
HTTPClient http;
WiFiClient wifiClient;

String macaddress = WiFi.macAddress();
String NameWifi = "SmartSocket:" + WiFi.macAddress();
int localip = WiFi.localIP();

//DATABASE
String IP_DATABASE = "http://mistersigz.thddns.net:7572";
String DATABASE_NODE = "http://mistersigz.thddns.net:7572/Node/AddMACAddress";
String DATABASE_TIME = "http://mistersigz.thddns.net:7572/time";
String DATABASE_RFID = "http://mistersigz.thddns.net:7572/Rfid/AddAddressRfid";
String DATABASE_TRANSACTION = "http://mistersigz.thddns.net:7572/Transaction/SendTransaction";
// unsigned long prevTime1 = millis();
// unsigned long prevTime2 = millis();
int dst = 0;
unsigned long lasTime1 = 0;
unsigned long lasTime2 = 0;
String SWITCH_ON = "false";
String SWITCH_OFF = "false";
String RUNING = "0";
String RUNING_CUR = "0";
int Check = 0;

String on_date = "";
String off_date = "";
String start_time = "";
String end_time = "";
unsigned long long int used_time = 0;
unsigned long long int temp_start = 0;
unsigned long long int temp_end = 0;
unsigned long long int temp_start_re = 0;
unsigned long long int temp_end_re = 0;
unsigned long long int temp_current = 0;
String current_time = "";
// String test = "1680799716968";
// unsigned long long start_time = 0;
// unsigned long int end_time = 0;
// unsigned long int used_time = 0;
// unsigned long int current_time = 0;

//------setup voltage------//
double sensorValue1 = 0;
double sensorValue2 = 0;
int crosscount = 0;
int climb_flag = 0;
int val[100];
int max_v = 0;
double VmaxD = 0;
double VeffD = 0;
double Veff = 0;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  tone(Passive_buzzer, 659);  //SOL note ...
  delay(500);
  noTone(Passive_buzzer);
  tone(Passive_buzzer, 659);  //SOL note ...
  delay(500);
  noTone(Passive_buzzer);
  tone(Passive_buzzer, 659);  //SOL note ...
  delay(500);
  noTone(Passive_buzzer);

  wifiManager.autoConnect(NameWifi.c_str(), "P@ssword");
  Serial.println("connected :)");
  tone(Passive_buzzer, 880);  //SOL note ...
  delay(1000);
  noTone(Passive_buzzer);
  if (WiFi.status() != WL_CONNECTED) {
    tone(Passive_buzzer, 659);  //SOL note ...
    delay(500);
    noTone(Passive_buzzer);
    tone(Passive_buzzer, 659);  //SOL note ...
    delay(500);
    noTone(Passive_buzzer);
    tone(Passive_buzzer, 659);  //SOL note ...
    delay(500);
    noTone(Passive_buzzer);
    wifiManager.resetSettings();
    wifiManager.autoConnect(NameWifi.c_str(), "P@ssword");
    Serial.println("connected :)");
    tone(Passive_buzzer, 523);  //SOL note ...
    delay(500);
    noTone(Passive_buzzer);
  }
  SPI.begin();
  mfrc522.PCD_Init();
  sentaddress();
}

void loop() {
  unsigned long currentTime1 = millis();
  unsigned long currentTime2 = millis();
  if (WiFi.status() == WL_CONNECTED) {
    http.begin(wifiClient, DATABASE_TIME.c_str());
    int httpResponseCode = http.GET();
    if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
      rfid_in = rfid_read();
      Serial.println(">>>> " + rfid_in);
      tone(Passive_buzzer, 880);  //SOL note ...
      delay(500);
      noTone(Passive_buzzer);
      http.begin(wifiClient, DATABASE_RFID.c_str());
      http.addHeader("Content-Type", "application/json");
      int httpCode = http.POST("{\"RfidAddress\":\"" + rfid_in + "\"}");
      if (httpCode == 200) {
        DynamicJsonDocument doc(2048);
        deserializeJson(doc, http.getStream());
        const int status = doc["status"];
        const String message = doc["message"];
        if (status == 1) {
          if (message.equals("Insert Rfid " + rfid_in + " Success")) {
            Serial.println("Insert Rfid " + rfid_in + " Success");
          } else if (message.equals("Have Rfid " + rfid_in)) {
            Serial.println("Have Rfid " + rfid_in);
          }
        }
      } else {
        tone(Passive_buzzer, 1046);  //SOL note ...
        delay(1000);
        noTone(Passive_buzzer);
        tone(Passive_buzzer, 1046);  //SOL note ...
        delay(1000);
        noTone(Passive_buzzer);
        Serial.print("Error on sending POST RFID: ");
        Serial.println(httpCode);
      }
      http.end();
    }
    if (currentTime1 - lasTime1 > 1000) {
      for (int i = 0; i < 100; i++) {
        sensorValue1 = analogRead(A0);
        if (analogRead(A0) > 600) {
          val[i] = sensorValue1;
        } else {
          val[i] = 0;
        }
        delay(1);
      }

      max_v = 0;

      for (int i = 0; i < 100; i++) {
        if (val[i] > max_v) {
          max_v = val[i];
        }
        val[i] = 0;
      }
      if (max_v != 0) {
        VmaxD = max_v;
        VeffD = VmaxD / sqrt(2);
        Veff = (((VeffD - 420.76) / -90.24) * -210.2) + 210.2;
      } else {
        Veff = 0;
      }
      Serial.print("Voltage: ");
      Serial.println(Veff);
      if (Veff > 670) {
        int httpResponseCode = http.GET();
        String payload = http.getString();
        Serial.println(payload);
        JSONVar myObject = JSON.parse(payload);
        if (RUNING == "0" && httpResponseCode == 200) {
          RUNING = "1";
          RUNING_CUR = "1";
          start_time = (const char*)myObject["epoch"];
          on_date = (const char*)myObject["date"];
          if (httpResponseCode > 0) {
            temp_start = strtoull(start_time.c_str(), NULL, 0);
          } else {
            Serial.print("Error code: ");
            Serial.println(httpResponseCode);
          }
          http.end();
        }
      } else {
        int httpResponseCode = http.GET();
        String payload = http.getString();
        if (RUNING == "1" && httpResponseCode == 200) {
          RUNING = "0";
          JSONVar myObject = JSON.parse(payload);
          end_time = (const char*)myObject["epoch"];
          off_date = (const char*)myObject["date"];
          temp_end = strtoull(end_time.c_str(), NULL, 0);
          if (httpResponseCode == 200 && (rfid_in != "" || rfid_in != null)) {
            used_time = (temp_end - temp_start);
            http.begin(wifiClient, DATABASE_TRANSACTION.c_str());
            http.addHeader("Content-Type", "application/json");  //Specify request destination
            int httpCode = http.POST("{\"Address\":\"" + macaddress + "\",\"RfidAddress\":\"" + rfid_in + "\",\"on_date\":\"" + on_date + "\",\"off_date\":\"" + off_date + "\",\"time_used\":\"" + used_time + "\"}");
            tone(Passive_buzzer, 1046);  //SOL note ...
            delay(500);
            noTone(Passive_buzzer);
          } else {
            tone(Passive_buzzer, 1046);  //SOL note ...
            delay(1000);
            noTone(Passive_buzzer);
            tone(Passive_buzzer, 1046);  //SOL note ...
            delay(1000);
            noTone(Passive_buzzer);
            Serial.print("Error code OFF_DATE: ");
            Serial.println(httpResponseCode);
          }
          http.end();
          rfid_in = "";
          Serial.print("rfid_in_is_NULL:");
        }
      }
      lasTime1 = currentTime1;
    } if (currentTime2 - lasTime2 > 86400000) {
      currentTime1 = 0;
      RUNING_CUR = "0";
      used_time = 0;
      lasTime1 = 0;
      if (httpResponseCode > 0) {
        String payload = http.getString();
        Serial.println(payload);
        JSONVar myObject = JSON.parse(payload);
        current_time = (const char*)myObject["epoch"];
        temp_current = strtoull(current_time.c_str(), NULL, 0);
        used_time = (temp_current - temp_start);
      }
      if (httpResponseCode == 200 && (rfid_in != "" || rfid_in != null)) {
        http.begin(wifiClient, DATABASE_TRANSACTION.c_str());
        http.addHeader("Content-Type", "application/json");  //Specify request destination
        int httpCode = http.POST("{\"Address\":\"" + macaddress + "\",\"RfidAddress\":\"" + rfid_in + "\",\"on_date\":\"" + on_date + "\",\"off_date\":\"" + "RUNNING" + "\",\"time_used\":\"" + used_time + "\"}");
      } else {
        tone(Passive_buzzer, 1046);  //SOL note ...
        delay(1000);
        noTone(Passive_buzzer);
        tone(Passive_buzzer, 1046);  //SOL note ...
        delay(1000);
        noTone(Passive_buzzer);
        Serial.print("Error code CURRENT_DATE: ");
        Serial.println(httpResponseCode);
        // ESP.restart();
      }
      // Free resources
      http.end();
      lasTime2 = currentTime2;
    }
  } else {
    tone(Passive_buzzer, 659);  //SOL note ...
    delay(500);
    noTone(Passive_buzzer);
    tone(Passive_buzzer, 659);  //SOL note ...
    delay(500);
    noTone(Passive_buzzer);
    tone(Passive_buzzer, 659);  //SOL note ...
    delay(500);
    noTone(Passive_buzzer);

    wifiManager.autoConnect(NameWifi.c_str(), "P@ssword");
    Serial.println("connected :)");
    tone(Passive_buzzer, 880);  //SOL note ...
    delay(1000);
    noTone(Passive_buzzer);
  }
}

//NODE
void sentaddress() {
  Serial.println(WiFi.localIP());
  HTTPClient http;                                  
  http.begin(wifiClient, (DATABASE_NODE.c_str()));  
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST("{\"Address\":\"" + macaddress + "\",\"LocalIP\":\"" + WiFi.localIP().toString() + "\"}");
  if (httpCode == 200) {
    DynamicJsonDocument doc(2048);
    deserializeJson(doc, http.getStream());
    const int status = doc["status"];
    const String message = doc["message"];
    if (status == 1) {
      if (message.equals("Insert Success")) {
        Serial.print("Insert Success");
      } else if (message.equals("Update Success")) {
        Serial.print("Update Success");
      }
    }
  } else {
    Serial.print("Error on sending POST Node: ");
    Serial.println(httpCode);
  }
  http.end();
}

//RFID
String rfid_read() {
  Serial.println("READ_RFID");
  String content = "";
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
    content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
  content.toUpperCase();
  return content.substring(1);
}
