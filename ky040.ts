let digitalPinNumber_Clock: DigitalPin;
let digitalPinNumber_Data: DigitalPin;
let digitalPinNumber_Switch: DigitalPin;
let digitalPinValue_Switch_Old = 1;
let pressedID = 5600;
let rotatedLeftID = 5601;
let rotatedRightID = 5602;
let rotateReady = true;

enum RotationDirection {
    Left = 0,
    Right = 1
}

//% color=50 weight=80
//% icon="\uf01e"
namespace RotaryEncoder {

    /**
     * rotary encoder was rotated.
     */
    //% blockId=rotary_ky_rotated_left_event
    //% block="on rotated |%dir"
    export function onRotateEvent(dir: RotationDirection, body: () => void): void {
        serial.setBaudRate(115200);
        // jwc following generates new dyanmic functions: 'control.onEvent(rotatedLeftID...' & 'control.onEvent(rotatedRightID...'
        //
        if (dir == RotationDirection.Left) control.onEvent(rotatedLeftID, dir, body);
        if (dir == RotationDirection.Right) control.onEvent(rotatedRightID, dir, body);
        
        control.inBackground(() => {
            while (true) {
                const digitalPinValue_Clock = pins.digitalReadPin(digitalPinNumber_Clock);
                const digitalPinValue_Data = pins.digitalReadPin(digitalPinNumber_Data);
                //// jwc o serial.writeValue("digitalPinNumber_Clock", digitalPinValue_Clock);
                //// jwc o serial.writeValue("digitalPinNumber_Data", digitalPinValue_Data);
                //// jwc y serial.writeLine("* C:" + convertToText(digitalPinValue_Clock) + " D:" + convertToText(digitalPinValue_Data))
                if (digitalPinValue_Clock == 1 && digitalPinValue_Data == 1) rotateReady = true;
                else if (rotateReady) {
                    ////jwc o if (digitalPinValue_Clock == 1 && digitalPinValue_Data == 0) {
                    if (digitalPinValue_Clock == 0 && digitalPinValue_Data == 1) {
                        serial.writeLine("***2 Right");
                        rotateReady = false;
                        control.raiseEvent(rotatedRightID, RotationDirection.Right);
                    }
                    ////jwc o else if (digitalPinValue_Clock == 0 && digitalPinValue_Data == 1) {
                    else if (digitalPinValue_Clock == 1 && digitalPinValue_Data == 0) {
                        serial.writeLine("***2 Left")
                        rotateReady = false;
                        control.raiseEvent(rotatedLeftID, RotationDirection.Left);
                    }
                    else{
                        serial.writeLine("***2 Neither Right nor Left")
                    }
                }
                else {
                    serial.writeLine("*1 Neither Stage 1")
                }
                basic.pause(5);
            }
        })
    }

    /**
     * rotary encoder button was pressed.
     */
    //% blockId=rotary_ky_pressed_event
    //% block="on button pressed"
    export function onPressEvent(body: () => void): void {
        control.onEvent(pressedID, 0, body);
        control.inBackground(() => {
            while (true) {
                const digitalPinValue_Switch = pins.digitalReadPin(digitalPinNumber_Switch);
                if (digitalPinValue_Switch != digitalPinValue_Switch_Old) {
                    digitalPinValue_Switch_Old = digitalPinValue_Switch;
                    if (digitalPinValue_Switch == 0) control.raiseEvent(pressedID, 0);
                }
                basic.pause(50);
            }
        })
    }

    /**
     * initialises local variables and enables the rotary encoder.
     */
    //% blockId=rotary_ky_init
    //% block="connect clk %clk|dt %dt|sw %sw"
    //% icon="\uf1ec"
    export function init(clk: DigitalPin, dt: DigitalPin, sw: DigitalPin): void {
        digitalPinNumber_Clock = clk;
        digitalPinNumber_Data = dt;
        digitalPinNumber_Switch = sw;
    }
}
