#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <EEPROM.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h> //v6

ESP8266WebServer server(80);

struct settings {
  char ssid[30];
  char password[30];
} user_wifi = {};
String macaddress = WiFi.macAddress();
int localip = WiFi.localIP();
const char* WEBSITE = "http://192.168.1.109:9090/MACAddress/AddMACAddress";
unsigned long prevTime = millis();
int count = 0;
WiFiClient wifiClient;

void setup() {
  Serial.begin(9600);
  EEPROM.begin(sizeof(struct settings) );
  EEPROM.get( 0, user_wifi );
   
  WiFi.begin(user_wifi.ssid, user_wifi.password);
  WiFi.softAP(macaddress, "P@ssw0rd");
  int count = 0;
  while(count <= 3000){
    if(WiFi.status() == WL_CONNECTED){
    Serial.println("cn");
    server.on("/",  startcn);
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
  server.begin();

    
}


void loop() {
    server.handleClient();
  String value = WiFi.macAddress();
  unsigned long currentTime = millis();
  HTTPClient http;    //Declare object of class HTTPClient
//  const int capacity = JSON_OBJECT_SIZE(2);
//  StaticJsonDocument<capacity> doc;
    if (WiFi.status() == WL_CONNECTED) {
      if(currentTime - prevTime > 1000){
        http.begin(wifiClient,"http://192.168.1.109:9090:9090/");
        http.addHeader("Content-Type", "application/json");//Specify request destination
        String stringOne = String(count);
        int httpCode = http.POST("{\"count\":\""+stringOne+"\"}");
        count++;
        if(httpCode == 200){
          String response = http.getString();
          Serial.println(response);        
        }
        else{
          Serial.print("Error on sending POST: ");
          Serial.println(httpCode);
        }
//        http.addHeader("Content-Type", "application/json");
//        int httpCode = http.POST("{\"M.A.C\":\""+value+"\"}");
//        if (httpCode > 0){
//          String response = http.getString();
//          Serial.println(httpCode);
//          Serial.println(response);
//        }
//        else{
//          Serial.print("Error on sending POST: ");
//          Serial.println(httpCode);
//        }
        http.end();
        prevTime = currentTime;
      }
  } else {
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
void startcn(){
    server.send(200,   "text/html",  "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><title>Wifi Setup</title><style>*,::after,::before{box-sizing:border-box;}body{margin:0;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans','Liberation Sans';font-size:1rem;font-weight:400;line-height:1.5;color:#212529;background-color:#f5f5f5;}.form-control{display:block;width:100%;height:calc(1.5em + .75rem + 2px);border:1px solid #ced4da;}button{border:1px solid transparent;color:#fff;background-color:#007bff;border-color:#007bff;padding:.5rem 1rem;font-size:1.25rem;line-height:1.5;border-radius:.3rem;width:100%}.form-signin{width:100%;max-width:400px;padding:15px;margin:auto;}h1,p{text-align: center}</style> </head> <body><main class='form-signin'> <h1>Wifi Setup</h1> <br/> <p>Your settings have been saved successfully!<br />You ssid is : "+WiFi.SSID()+"</p><br /><p>macAddress : "+WiFi.macAddress()+"</p></main></body></html>" );
}
void sentaddress(){
  Serial.println(WiFi.localIP());
  HTTPClient http;    //Declare object of class HTTPClient
  http.begin(wifiClient,WEBSITE);      //Specify request destination
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