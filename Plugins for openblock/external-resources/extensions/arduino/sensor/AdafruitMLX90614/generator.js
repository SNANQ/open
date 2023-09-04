/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
function addGenerator (Blockly) {
    Blockly.Arduino.AdafruitMLX90614_init = function () {
        Blockly.Arduino.includes_.AdafruitMLX90614_init = `#include <Adafruit_MLX90614.h>\nAdafruit_MLX90614 mlx = Adafruit_MLX90614();`;

        return 'mlx.begin();\n';
    };

    Blockly.Arduino.AdafruitMLX90614_readObjectTempC = function () {
        return [`mlx.readObjectTempC()`, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.AdafruitMLX90614_readAmbientTempC = function () {
        return [`mlx.readAmbientTempC()`, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.AdafruitMLX90614_readObjectTempF = function () {
        return [`mlx.readObjectTempF()`, Blockly.Arduino.ORDER_ATOMIC];
    };

    Blockly.Arduino.AdafruitMLX90614_readAmbientTempF = function () {
        return [`mlx.readAmbientTempF()`, Blockly.Arduino.ORDER_ATOMIC];
    };

    return Blockly;
}

exports = addGenerator;
