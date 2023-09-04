/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
function addBlocks (Blockly) {
    const color = '#FF0000';
    const secondaryColour = '#000000';

    Blockly.Blocks.AdafruitMLX90614_init = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.AdafruitMLX90614_INIT,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['shape_statement']
            });
        }
    };

    Blockly.Blocks.AdafruitMLX90614_readObjectTempC = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.AdafruitMLX90614_readObjectTempC,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_number']
            });
        }
    };

    Blockly.Blocks.AdafruitMLX90614_readAmbientTempC = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.AdafruitMLX90614_readAmbientTempC,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_number']
            });
        }
    };

    Blockly.Blocks.AdafruitMLX90614_readObjectTempF = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.AdafruitMLX90614_readObjectTempF,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_number']
            });
        }
    };

    Blockly.Blocks.AdafruitMLX90614_readAmbientTempF = {
        init: function () {
            this.jsonInit({
                message0: Blockly.Msg.AdafruitMLX90614_readAmbientTempF,
                colour: color,
                secondaryColour: secondaryColour,
                extensions: ['output_number']
            });
        }
    };

    return Blockly;
}

exports = addBlocks;
