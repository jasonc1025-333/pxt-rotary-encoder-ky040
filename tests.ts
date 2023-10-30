// tests go here; this will not be compiled when this package is used as a library

let item = 5;
//// jwc o RotaryEncoder.init(DigitalPin.P8, DigitalPin.P9, DigitalPin.P11);
RotaryEncoder.init(DigitalPin.P13, DigitalPin.P14, DigitalPin.P15);
basic.showIcon(IconNames.Happy);
basic.pause(2000)

basic.forever(() => {
    basic.showNumber(item);
})
RotaryEncoder.onPressEvent(() => {
    serial.writeString("*****3 test.ts: onPress\n");
    item = 5;
    basic.showIcon(IconNames.Heart);
})
RotaryEncoder.onRotateEvent(RotationDirection.Right, () => {
    item++;
    ////jwc o serial.writeString("***** test.ts: rotate right\n");
    serial.writeLine("*****3 test.ts: rotate right: " + convertToText(item))
})
RotaryEncoder.onRotateEvent(RotationDirection.Left, () => {
    item--;
    ////jwc o serial.writeString("***** test.ts: rotate left\n");
    serial.writeLine("*****3 test.ts: rotate left: " + convertToText(item))
})
