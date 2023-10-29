// jwc 23-1028-2000 1st Draft

let encoder_A_C1_AnalogPin: AnalogPin;
let encoder_B_C2_AnalogPin: AnalogPin;

let encoder_A_C1_AnalogPin_Value_Now = 0;
let encoder_B_C2_AnalogPin_Value_Now = 0;

let encoder_A_C1_DigitalValue_Now = 0;
let encoder_B_C2_DigitalValue_Now = 0;

let encoder_A_C1_DigitalValue_Old = 0;
let encoder_B_C2_DigitalValue_Old = 0;

let encoder_A_C1_DigitalValue_StateRiseFallChange_Count_Int = 0;
let encoder_B_C2_DigitalValue_StateRiseFallChange_Count_Int = 0;

let __system_Debug_On_Bool = false;

let on_EncoderNewState_Event_Id = 5600;

let ri: DigitalPin;
let dv: DigitalPin;
let dsw: DigitalPin;
let lastPressed = 1;
//// jwc o let pressedID = 5600;
let pressedID = 5603;
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
    //% blockId=on_EncoderNewState_Event_Fn
    //% block="on_EncoderNewState_Event_Fn | encoder_digitalvalue_staterisefallchange_count_target_in: %encoder_digitalvalue_staterisefallchange_count_target_in"
    export function on_EncoderNewState_Event_Fn(encoder_digitalvalue_staterisefallchange_count_target_in: number, cpu_delay_msec_in: number, body: () => void): void {
        serial.setBaudRate(115200);
        control.onEvent(on_EncoderNewState_Event_Id, encoder_digitalvalue_staterisefallchange_count_target_in, body);
        control.inBackground(() => {
            while (true) {

                encoder_B_C2_AnalogPin_Value_Now = pins.analogReadPin(encoder_B_C2_AnalogPin);
                
                if (encoder_B_C2_AnalogPin_Value_Now == 0) {
                    encoder_B_C2_DigitalValue_Now = 0
                } else {
                    encoder_B_C2_DigitalValue_Now = 1
                }

                if (encoder_B_C2_DigitalValue_StateRiseFallChange_Count_Int >= encoder_digitalvalue_staterisefallchange_count_target_in){
                    control.raiseEvent(on_EncoderNewState_Event_Id, encoder_B_C2_DigitalValue_StateRiseFallChange_Count_Int);
                    control.raiseEvent(EventBusSource.MICROBIT_ID_IO_P0, EventBusValue.MICROBIT_RADIO_EVT_DATAGRAM)

                    // No need to place under '__system_Debug_On_Bool' since not resource_hungry
                    serial.writeLine("***** b_c2:: on_EncoderNewState_Event_Id:: " + " StateChg_Target:" + convertToText(encoder_digitalvalue_staterisefallchange_count_target_in) + " StateChg_Now:" + convertToText(encoder_B_C2_DigitalValue_StateRiseFallChange_Count_Int) + " cpu_delay_msec_in:" + convertToText(cpu_delay_msec_in));
                    encoder_B_C2_DigitalValue_StateRiseFallChange_Count_Int = 0;
                }

                if (__system_Debug_On_Bool) {                
                    serial.writeLine("* b_c2:: " + " Ana:" + convertToText(encoder_B_C2_AnalogPin_Value_Now) + " Dig+:" + convertToText(encoder_B_C2_DigitalValue_Now) + " Dig-:" + convertToText(encoder_B_C2_DigitalValue_Old) + " StateChg_Target:" + convertToText(encoder_digitalvalue_staterisefallchange_count_target_in) + " StateChg_Now:" + convertToText(encoder_B_C2_DigitalValue_StateRiseFallChange_Count_Int));
                }
       
                if (encoder_B_C2_DigitalValue_Now != encoder_B_C2_DigitalValue_Old) {
                    encoder_B_C2_DigitalValue_Old = encoder_B_C2_DigitalValue_Now
                    encoder_B_C2_DigitalValue_StateRiseFallChange_Count_Int += 1
                }

                /// jwc encoder_A_C1_AnalogPin_Value_Now = pins.analogReadPin(encoder_A_C1_AnalogPin);

                ///jwc template: if (riValue == 1 && dvValue == 1) rotateReady = true;
                ///jwc template: else if (rotateReady) {
                ///jwc template:     if (riValue == 1 && dvValue == 0) {
                ///jwc template:         serial.writeLine("Right!");
                ///jwc template:         rotateReady = false;
                ///jwc template:         control.raiseEvent(rotatedRightID, RotationDirection.Right);
                ///jwc template:     }
                ///jwc template:     else if (riValue == 0 && dvValue == 1) {
                ///jwc template:         serial.writeLine("Left!")
                ///jwc template:         rotateReady = false;
                ///jwc template:         control.raiseEvent(rotatedLeftID, RotationDirection.Left);
                ///jwc template:     }
                ///jwc template: }
                
                /// jwc TODO need to readjust?
                /// jwc y basic.pause(5);
                basic.pause(cpu_delay_msec_in);
            }
        })
    }
    /**
     * rotary encoder was rotated.
     */
    //% blockId=rotary_ky_rotated_left_event
    //% block="on rotated |%dir"
    export function onRotateEvent(dir: RotationDirection, body: () => void): void {
        serial.setBaudRate(115200);
        if (dir == RotationDirection.Left) control.onEvent(rotatedLeftID, dir, body);
        if (dir == RotationDirection.Right) control.onEvent(rotatedRightID, dir, body);
        control.inBackground(() => {
            while (true) {
                const riValue = pins.digitalReadPin(ri);
                const dvValue = pins.digitalReadPin(dv);
                serial.writeValue("ri", riValue);
                serial.writeValue("dv", dvValue);
                if (riValue == 1 && dvValue == 1) rotateReady = true;
                else if (rotateReady) {
                    if (riValue == 1 && dvValue == 0) {
                        serial.writeLine("Right!");
                        rotateReady = false;
                        control.raiseEvent(rotatedRightID, RotationDirection.Right);
                    }
                    else if (riValue == 0 && dvValue == 1) {
                        serial.writeLine("Left!")
                        rotateReady = false;
                        control.raiseEvent(rotatedLeftID, RotationDirection.Left);
                    }
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
                const pressed = pins.digitalReadPin(dsw);
                if (pressed != lastPressed) {
                    lastPressed = pressed;
                    if (pressed == 0) control.raiseEvent(pressedID, 0);
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
        ri = clk;
        dv = dt;
        dsw = sw;
    }
    /**
     * initialises local variables and enables the rotary encoder.
     */
    //% blockId=init_Encoder_AnalogPins
    //% block="connect encoder_A_C1_In %encoder_A_C1_In|encoder_B_C2_In %encoder_B_C2_In"
    //% icon="\uf1ec"
    export function init_Encoder_AnalogPins_Fn(encoder_A_C1_In: AnalogPin, encoder_B_C2_In: AnalogPin): void {
        encoder_A_C1_AnalogPin = encoder_A_C1_In;
        encoder_B_C2_AnalogPin = encoder_B_C2_In;
    }

}
