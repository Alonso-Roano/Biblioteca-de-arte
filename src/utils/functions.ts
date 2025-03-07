const getTextColor = (color:string) => {
    const rgb = hexToRgb(color);
    if (!rgb) return 'white';

    const { r, g, b } = rgb;
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
    return brightness < 128 ? 'white' : 'black';
  };

  const hexToRgb = (hex:any) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map((x:any) => x + x).join('');
    }
    const bigint = parseInt(hex, 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255
    };
  };

export {getTextColor}