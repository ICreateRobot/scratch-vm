/**
 * Block argument types
 * @enum {string}
 */
const ArgumentType = {
    /**
     * Numeric value with angle picker
     */
    ANGLE: 'angle',

    /**
     * Boolean value with hexagonal placeholder
     */
    BOOLEAN: 'Boolean',

    /**
     * Numeric value with color picker
     */
    COLOR: 'color',

    /**
     * Numeric value with text field
     */
    NUMBER: 'number',

    /**
     * String value with text field
     */
    STRING: 'string',

    /**
     * String value with matrix field
     */
    MATRIX: 'matrix',


    MATRIXCUSTOM: 'matrix_custom',
    MATRIXONEROW: 'matrix_onerow',
    /**
     * MIDI note number with note picker (piano) field
     */
    NOTE: 'note',

    /**
     * Inline image on block (as part of the label)
     */
    IMAGE: 'image',

    /**
     * Name of costume in the current target
     */
    COSTUME: 'costume',

    /**
     * Name of sound in the current target
     */
    SOUND: 'sound',
      /**
     *限制输入大小0-4
    */
     NUMRES0_4: 'numres0D4',

     /**
      *限制输入大小0-9
     */
     NUMRES0_9: 'numres0D9',
 
     /**
      *限制输入大小40-500
     */
     NUMRES40_500: 'numres40D500',
 
     /**
      *限制输入大小20-10000
     */
     NUMRES20_10000: 'numres20D10000',
 
     /**
      *限制输入大小0-255
     */
     NUMRES0_255: 'numres0D255',
 
     /**
      *限制输入大小-255-255
     */
     NUMRES_255_255: 'numresD255D255',
 
     /**
      *限制输入大小0-300
     */
     NUMRES0_300: 'numres0D300',
 
     /**
      *限制输入大小-100-100
     */
     NUMRES_100_100: 'numresD100D100',
 
     /**
      *限制输入大小0-
     */
     NUMRES0: 'numres0',
 
     /**
      *限制输入大小0-100
     */
     NUMRES0_100: 'numres0D100',
 
     /**
      *限制输入大小-360-360
     */
     NUMRES_360_360: 'numresD360D360',
 
     /**
      *限制输入大小-32400-32400
     */
     NUMRES_32400_32400: 'numresD32400D32400',
 
     /**
      *限制输入大小0-65535
     */
     NUMRES0_65535: 'numres0D65535',
};

module.exports = ArgumentType;
