#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <WiFiClient.h>
#include <NTPClient.h>
#include <ESP8266HTTPClient.h>
#include <WiFiUdp.h>
#include <ArduinoJson.h> //v6
//#define LED D4

ESP8266WebServer server(80);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP,"pool.ntp.org");
struct settings {
  char ssid[30];
  char password[30];
} user_wifi = {};
String macaddress = WiFi.macAddress();
int localip = WiFi.localIP();
String IP_DATABASE = "http://192.168.43.250:9090";
unsigned long prevTime = millis();
int count = 0;
int timezone= 7*3600;
int dst=0;
String SWITCH_ON = "false";
String SWITCH_OFF = "false";
String RUNING = "false";
unsigned long start_time=0;
unsigned long end_time=0;
unsigned long used_time=0;
int day=0;
int month=0;
int year=0;
String on_date="";
String off_date="";
bool LEDstatus = LOW;
WiFiClient wifiClient;

String weekDays[7]={"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"};

//Month names
String months[12]={"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"};

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
  Serial.begin(9600);
  EEPROM.begin(sizeof(struct settings) );
  EEPROM.get( 0, user_wifi );
   
  WiFi.begin(user_wifi.ssid, user_wifi.password);
  WiFi.softAP(macaddress, "P@ssw0rd");
  //pinMode(LED, OUTPUT);
  pinMode(D4, OUTPUT);
  //digitalWrite(LED, LOW);
  int count = 0;
  while(count <= 3000){
    if(WiFi.status() == WL_CONNECTED){
    Serial.println("cn");
    timeClient.begin();
    timeClient.setTimeOffset(25200);
    Serial.println("\nLoading time");
    while(!time(nullptr)){
      Serial.print("*");
    }
   server.on("/",handle_OnConnect);
    break;
    }
    else{
      Serial.println(count);
      count++;
    }
  }
  if(WiFi.status() != WL_CONNECTED){
    Serial.println("nc");
    server.on("/",  handlePortal);
  }
  else{
    sentaddress();  
  }
  server.on("/ledon", handle_ledon);
  server.on("/ledoff", handle_ledoff);
  server.onNotFound(handle_NotFound);
  server.begin();
}


void loop() {
  server.handleClient();
  timeClient.update();
  String value = WiFi.macAddress();
  unsigned long currentTime = millis();

  time_t epochTime = timeClient.getEpochTime();
  struct tm *ptm = gmtime ((time_t *)&epochTime);
//  time_t now =time(nullptr);
//  struct tm* p_tm=localtime(&now);
  HTTPClient http;    //Declare object of class HTTPClient
//  const int capacity = JSON_OBJECT_SIZE(2);
//  StaticJsonDocument<capacity> doc;
    if (WiFi.status() == WL_CONNECTED) {
      if(currentTime - prevTime > 5000){
        for ( int i = 0; i < 100; i++ ) {
          sensorValue1 = analogRead(A0);
          if (analogRead(A0) > 600) {
            val[i] = sensorValue1;
          }
          else {
            val[i] = 0;
          }
          delay(1);
        }

        max_v = 0;

        for ( int i = 0; i < 100; i++ ){
          if ( val[i] > max_v )
          {
            max_v = val[i];
          }
          val[i] = 0;
        }
        if (max_v != 0) {
          VmaxD = max_v;
          VeffD = VmaxD / sqrt(2);
          Veff = (((VeffD - 420.76) / -90.24) * -210.2) + 210.2;
        }
        else {
          Veff = 0;
        }
        Serial.print("Voltage: ");
        Serial.println(Veff);
        if(Veff >= 635){//SWITCH_ON == "true"
          Serial.println("SWITCH_ON Veff>=635");
          digitalWrite(D4, LOW);
          start_time = timeClient.getEpochTime();
          day=ptm->tm_mday;
          month=ptm->tm_mon+1;
          year=ptm->tm_year+1900;
          on_date = String(year) + "-" + String(month) + "-" + String(day)+" "+String( timeClient.getFormattedTime());
          if(Veff >= 635){
//            SWITCH_ON="false";
            Serial.println(start_time);
            Serial.println(on_date);
          }
         }
         else{
//            Serial.println(SWITCH_OFF);
            Serial.println("SWITCH_OFF Veff<635");
            digitalWrite(D4, HIGH);
            end_time = timeClient.getEpochTime();
            day=ptm->tm_mday;
            month=ptm->tm_mon+1;
            year=ptm->tm_year+1900;
            off_date = String(year) + "-" + String(month) + "-" + String(day)+" "+String( timeClient.getFormattedTime());
            used_time= (end_time-start_time)*1000;
            Serial.println(start_time);
            Serial.println(end_time);
            Serial.println(on_date);
            Serial.println(off_date);
            http.begin(wifiClient,IP_DATABASE+"/Transection/SendTransection");
            http.addHeader("Content-Type", "application/json");//Specify request destination
            int httpCode = http.POST("{\"Address\":\""+macaddress+"\",\"Status\":\""+"active"+"\",\"on_date\":\""+on_date+"\",\"off_date\":\""+off_date+"\",\"time_used\":\""+used_time+"\"}");
            // if(SWITCH_OFF == "true"){
            //   SWITCH_OFF="false";
            // }
            if(httpCode == 200){
              String response = http.getString();
              Serial.println(response);
            }
            else{
              Serial.print("Error on sending POST: ");
              Serial.println(httpCode);
            }
            http.end();
          }

//         else if(RUNING =="true"){
//          Serial.println(RUNING);
//          http.begin(wifiClient,IP_DATABASE+"/Transection/SendTransection");
//          http.addHeader("Content-Type", "application/json");//Specify request destination
//          int httpCode = http.POST("{\"Address\":\""+macaddress+"\",\"Status\":\""+"RUNING"+"\"}");
//          if(httpCode == 200){
//            String response = http.getString();
//            Serial.println(response);
//          }
//          else{
//            Serial.print("Error on sending POST: ");
//            Serial.println(httpCode);
//          }
//          http.end();             
//        }
          VmaxD = 0;
          prevTime = currentTime;
        }
  } 
  else {
    Serial.println("Error in WiFi connection");
  }
}

void handlePortal() {
  if (server.method() == HTTP_POST) {
    strncpy(user_wifi.ssid,     server.arg("ssid").c_str(),     sizeof(user_wifi.ssid) );
    strncpy(user_wifi.password, server.arg("password").c_str(), sizeof(user_wifi.password) );
    user_wifi.ssid[server.arg("ssid").length()] = user_wifi.password[server.arg("password").length()] = '\0';
    EEPROM.put(0, user_wifi);
    EEPROM.commit();

    server.send(200,   "text/html",  "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title><style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1,p{text-align: center}</style> </head> <body><main class='form-signin'> <h1>Wifi Setup</h1> <br/> <p>Your settings have been saved successfully!<br />Please restart the device.</p></main></body></html>" );
  } else {

    server.send(200,   "text/html", "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title> <style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{cursor: pointer;border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1{text-align: center}</style> </head> <body><main class='form-signin'> <form action='/' method='post'> <h1 class=''>Wifi Setup</h1><br/><div class='form-floating'><label>SSID</label><input type='text' class='form-control' name='ssid'> </div><div class='form-floating'><br/><label>Password</label><input type='password' class='form-control' name='password'></div><br/><br/><button type='submit'>Save</button><p style='text-align: right'><a href='https://www.mrdiy.ca' style='color: #32C5FF'>mrdiy.ca</a></p></form></main> </body></html>" );
  }
}
//void startcn(){
//     server.send(200, "text/html", updateWebpage(LEDstatus));
////server.send(200,   "text/html",  "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title><style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1,p{text-align: center}</style> </head> <body><main class='form-signin'> <h1>Wifi Setup</h1> <br/> <p>Your settings have been saved successfully!<br />You ssid is : "+WiFi.SSID()+"</p><br /><p>macAddress : "+WiFi.macAddress()+"</p></main></body></html>" );
//}
void sentaddress(){
  Serial.println(WiFi.localIP());
  HTTPClient http;    //Declare object of class HTTPClient
  http.begin(wifiClient,IP_DATABASE+"/Node/AddMACAddress");      //Specify request destination
  http.addHeader("Content-Type", "application/json");
  int httpCode = http.POST("{\"Address\":\""+macaddress+"\",\"LocalIP\":\""+WiFi.localIP().toString()+"\"}");
  if(httpCode == 200){
    DynamicJsonDocument doc(2048);
    deserializeJson(doc, http.getStream());
    const int status = doc["status"];
    const String message = doc["message"];
    if(status == 1){
      if(message.equals("Insert Success")){
         Serial.print("Insert Success");        
      }
      else if(message.equals("Update Success")){
         Serial.print("Update Success");        
      }
    }
  }
  else{
      Serial.print("Error on sending POST: ");
      Serial.println(httpCode);
  }
  http.end();
}

void handle_OnConnect() {
  LEDstatus = LOW;
  server.send(200, "text/html", updateWebpage(LEDstatus)); 
}

void handle_ledoff() {
  LEDstatus = HIGH;
  SWITCH_OFF = "true";
  Serial.println("LED: OFF");
  server.send(200, "text/html", updateWebpage(LEDstatus)); 
}

void handle_ledon() {
  LEDstatus = LOW;
  SWITCH_ON = "true";
  Serial.println("LED: ON");
  server.send(200, "text/html", updateWebpage(LEDstatus)); 
}

void handle_NotFound(){
  server.send(404, "text/plain", "Not found");
}

String updateWebpage(uint8_t LEDstatus){
  String ptr = "<!DOCTYPE html> <html>\n";
  ptr +="<head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, user-scalable=no\">\n";
  ptr +="<title>LED Control</title>\n";
  ptr +="<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}\n";
  ptr +="body{margin-top: 50px;} h1 {color: #444444;margin: 50px auto 30px;} h3 {color: #444444;margin-bottom: 50px;}\n";
  ptr +=".button {display: block;width: 80px;background-color: #1abc9c;border: none;color: white;padding: 13px 30px;text-decoration: none;font-size: 25px;margin: 0px auto 35px;cursor: pointer;border-radius: 4px;}\n";
  ptr +=".button-on {background-color: #3498db;}\n";
  ptr +=".button-on:active {background-color: #3498db;}\n";
  ptr +=".button-off {background-color: #34495e;}\n";
  ptr +=".button-off:active {background-color: #2c3e50;}\n";
  ptr +="p {font-size: 14px;color: #888;margin-bottom: 10px;}\n";
  ptr +="</style>\n";
  ptr +="</head>\n";
  ptr +="<body>\n";
  ptr+="<h1>Wifi Setup</h1>\n" ;
  ptr+= "<br/>\n" ;
  ptr+= "<p>Your settings have been saved successfully!<br />You ssid is : "+WiFi.SSID()+"</p>\n";
  ptr+= "<br /><p>macAddress : "+WiFi.macAddress()+"</p>\n";
  ptr +="<h1>ESP8266 Web Server</h1>\n";
  ptr +="<h3>Using Access Point(AP) Mode</h3>\n";

  
   if(LEDstatus){
    ptr +="<p>BLUE LED: ON</p><a class=\"button button-off\" href=\"/ledoff\">OFF</a>\n";
   }else{
    ptr +="<p>BLUE LED: OFF</p><a class=\"button button-on\" href=\"/ledon\">ON</a>\n";
  }

  ptr +="</body>\n";
  ptr +="</html>\n";
  return ptr;
}