/*
|-----------------------------------------------------------------------------
| Text sizes                         https://tailwindcss.com/docs/text-sizing
|-----------------------------------------------------------------------------
|
| Here is where you define your text sizes. Name these in whatever way
| makes the most sense to you. We use size names by default, but
| you're welcome to use a numeric scale or even something else
| entirely.
|
| By default Tailwind uses the "rem" unit type for most measurements.
| This allows you to set a root font size which all other sizes are
| then based on. That said, you are free to use whatever units you
| prefer, be it rems, ems, pixels or other.
|
| Class name: .text-{size}
|
*/
let textSizes = {
  'xxs':      '12px',
  'xs':       '14px',
  'sm':       '15px',
  'base':     '16px',
  'large-1':  '18px',
  'large-2':  '20px',
  'large-3':  '22px',
  'large-4':  '24px',
  'large-5':  '30px',
  'large-6':  '36px',
  'large-7':  '42px',
  'jumbo-1':  '60px',
  'jumbo-2':  '74px',
  'jumbo-3':  '86px'
};

// Convert pixel sizes to REMs
export default Object.keys(textSizes).reduce((memo, textSize) => {
  let pixelValue = textSizes[textSize];
  let remValue = `${(+pixelValue.replace('px', '') / 16)}rem`;

  memo[textSize] = remValue;

  return memo;
}, {});
