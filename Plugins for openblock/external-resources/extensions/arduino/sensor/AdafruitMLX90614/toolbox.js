/* eslint-disable func-style */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
function addToolbox () {
    return `
<category name="%{BKY_ADAFRUITMLX90614_CATEGORY}" id="ADAFRUITMLX90614_CATEGORY" colour="#FF0000" secondaryColour="#000000">
    <block type="AdafruitMLX90614_init" id="AdafruitMLX90614_init">
    </block>
    <block type="AdafruitMLX90614_readObjectTempC" id="AdafruitMLX90614_readObjectTempC">
    </block>
    <block type="AdafruitMLX90614_readAmbientTempC" id="AdafruitMLX90614_readAmbientTempC">
    </block>
    <block type="AdafruitMLX90614_readObjectTempF" id="AdafruitMLX90614_readObjectTempF">
    </block>
    <block type="AdafruitMLX90614_readAmbientTempF" id="AdafruitMLX90614_readAmbientTempF">
    </block>
</category>`;
}

exports = addToolbox;
