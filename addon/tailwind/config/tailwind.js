import colors from './colors';
import screens from './screens';
import fonts from './fonts';
import textSizes from './text-sizes';
import fontWeights from './font-weights';
import leading from './line-height';
import tracking from './letter-spacing';
import textColors from './text-colors';
import backgroundColors from './background-colors';
import backgroundSize from './background-size';
import borderWidths from './border-widths';
import borderColors from './border-colors';
import borderRadius from './border-radius';
import width from './width';
import height from './height';
import minWidth from './min-width';
import minHeight from './min-height';
import maxWidth from './max-width';
import maxHeight from './max-height';
import padding from './padding';
import margin from './margin';
import negativeMargin from './negative-margin';
import shadows from './shadows';
import zIndex from './z-index';
import opacity from './opacity';
import svgFill from './svg-fill';
import svgStroke from './svg-stroke';

export default {

  colors,
  screens,
  fonts,
  textSizes,
  fontWeights,
  leading,
  tracking,
  textColors,
  backgroundColors,
  backgroundSize,
  borderWidths,
  borderColors,
  borderRadius,
  width,
  height,
  minWidth,
  minHeight,
  maxWidth,
  maxHeight,
  padding,
  margin,
  negativeMargin,
  shadows,
  zIndex,
  opacity,
  svgFill,
  svgStroke,

  modules: {
    appearance: ['responsive'],
    backgroundAttachment: ['responsive'],
    backgroundColors: ['responsive', 'hover', 'focus'],
    backgroundPosition: ['responsive'],
    backgroundRepeat: ['responsive'],
    backgroundSize: ['responsive'],
    borderColors: ['responsive', 'hover'],
    borderRadius: ['responsive'],
    borderStyle: ['responsive'],
    borderWidths: ['responsive'],
    cursor: ['responsive'],
    display: ['responsive'],
    flexbox: ['responsive'],
    float: ['responsive'],
    fonts: ['responsive'],
    fontWeights: ['responsive', 'hover'],
    height: ['responsive'],
    leading: ['responsive'],
    lists: ['responsive'],
    margin: ['responsive'],
    maxHeight: ['responsive'],
    maxWidth: ['responsive'],
    minHeight: ['responsive'],
    minWidth: ['responsive'],
    negativeMargin: ['responsive'],
    opacity: ['responsive', 'hover', 'group-hover'],
    overflow: ['responsive'],
    padding: ['responsive'],
    pointerEvents: ['responsive'],
    position: ['responsive'],
    resize: ['responsive'],
    shadows: ['responsive', 'hover'],
    svgFill: [],
    svgStroke: [],
    textAlign: ['responsive'],
    textColors: ['responsive', 'hover'],
    textSizes: ['responsive'],
    textStyle: ['responsive', 'hover'],
    tracking: ['responsive'],
    userSelect: ['responsive'],
    verticalAlign: ['responsive'],
    visibility: ['responsive'],
    whitespace: ['responsive'],
    width: ['responsive'],
    zIndex: ['responsive'],
  },

  /*
  |-----------------------------------------------------------------------------
  | Plugins                                https://tailwindcss.com/docs/plugins
  |-----------------------------------------------------------------------------
  |
  | Here is where you can register any plugins you'd like to use in your
  | project. Tailwind's built-in `container` plugin is enabled by default to
  | give you a Bootstrap-style responsive container component out of the box.
  |
  | Be sure to view the complete plugin documentation to learn more about how
  | the plugin system works.
  |
  */
   plugins: [
  ],

  /*
  |-----------------------------------------------------------------------------
  | Advanced Options         https://tailwindcss.com/docs/configuration#options
  |-----------------------------------------------------------------------------
  |
  | Here is where you can tweak advanced configuration options. We recommend
  | leaving these options alone unless you absolutely need to change them.
  |
  */

  options: {
    prefix: 'docs-',
    important: false,
    separator: ':',
  },

}
