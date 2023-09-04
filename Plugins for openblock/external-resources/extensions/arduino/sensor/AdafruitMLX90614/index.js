const AdafruitMLX90614 = formatMessage => ({
    name: 'AdafruitMLX90614',
    extensionId: 'AdafruitMLX90614',
    version: '0.0.1',
    supportDevice: ['arduinoUno', 'arduinoNano', 'arduinoLeonardo',
        'arduinoMega2560', 'arduinoEsp32', 'arduinoEsp8266'],
    author: 'shanghuo',
    iconURL: `asset/AdafruitMLX90614.png`,
    description: formatMessage({
        id: 'AdafruitMLX90614.description',
        default: 'It is allowed to read the data of GY-906 infrared temperature sensor.'
    }),
    featured: true,
    blocks: 'blocks.js',
    generator: 'generator.js',
    toolbox: 'toolbox.js',
    msg: 'msg.js',
    library: 'lib',
    official: true,
    tags: ['sensor'],
    helpLink: 'https://www.snang.cc'
});

module.exports = AdafruitMLX90614;
