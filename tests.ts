// tests go here; this will not be compiled when this package is used as a library

let encoder_A_C1_DigitalValue_StateRiseFallChange_Count_2_Int = 0;
let encoder_B_C2_DigitalValue_StateRiseFallChange_Count_2_Int = 0;

RotaryEncoder.init_Encoder_AnalogPins_Fn(AnalogPin.P0, AnalogPin.P1);

RotaryEncoder.on_EncoderNewState_Event_Fn(1000, 1, true, () => {
    encoder_B_C2_DigitalValue_StateRiseFallChange_Count_2_Int +=1;
    serial.writeLine("***** ***** RotaryEncoder.on_EncoderNewState_Event_Fn: " + convertToText(encoder_B_C2_DigitalValue_StateRiseFallChange_Count_2_Int));
})


/// jwc o let item = 5;
/// jwc o 
/// jwc o RotaryEncoder.init(DigitalPin.P8, DigitalPin.P9, DigitalPin.P11);
/// jwc o basic.forever(() => {
/// jwc o     basic.showNumber(item);
/// jwc o })
/// jwc o RotaryEncoder.onPressEvent(() => {
/// jwc o     //serial.writeString("onPress\n");
/// jwc o     item = 5;
/// jwc o     basic.showIcon(IconNames.Heart);
/// jwc o })
/// jwc o RotaryEncoder.onRotateEvent(RotationDirection.Right, () => {
/// jwc o     //serial.writeString("rotate right\n");
/// jwc o     item++;
/// jwc o })
/// jwc o RotaryEncoder.onRotateEvent(RotationDirection.Left, () => {
/// jwc o     //serial.writeString("rotate left\n");
/// jwc o     item--;
/// jwc o })
