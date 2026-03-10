
const int SENSOR_PIN = A0;
const int UMBRAL = 500;
const int HYSTERESIS = 15;

String bufferLine = "";
bool activeState = false;

bool computeState(int value) {
  if (activeState) {
    if (value <= UMBRAL - HYSTERESIS) {
      activeState = false;
    }
  } else {
    if (value >= UMBRAL + HYSTERESIS) {
      activeState = true;
    }
  }
  return activeState;
}

void printStatus() {
  int value = analogRead(SENSOR_PIN);
  bool active = computeState(value);

  Serial.print("OK ");
  Serial.print("a0=");
  Serial.print(value);

  Serial.print(" threshold=");
  Serial.print(UMBRAL);

  Serial.print(" red=");
  Serial.print(active ? 1 : 0);

  Serial.print(" green=");
  Serial.print(active ? 1 : 0);

  Serial.print(" state=");
  Serial.print(active ? "ACTIVO" : "REPOSO");

  Serial.print(" mode=ANALOG");
  Serial.print(" input=A0");
  Serial.print(" leds=HARDWARE");
  Serial.print(" driver=TRANSISTOR");
  Serial.println();
}

void handleCommand(String cmd) {
  cmd.trim();
  cmd.toUpperCase();

  if (cmd == "PING") {
    Serial.println("OK pong");
    return;
  }

  if (cmd == "GET" || cmd == "READ" || cmd == "STATUS") {
    printStatus();
    return;
  }

  Serial.println("ERR comando_no_valido");
}

void setup() {
  Serial.begin(115200);
  delay(250);
  Serial.println("OK Arduino_A0_listo");
}

void loop() {
  int value = analogRead(SENSOR_PIN);
  computeState(value);

  while (Serial.available() > 0) {
    char c = (char)Serial.read();

    if (c == '\n' || c == '\r') {
      if (bufferLine.length() > 0) {
        handleCommand(bufferLine);
        bufferLine = "";
      }
    } else {
      bufferLine += c;
    }
  }
}
