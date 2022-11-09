export default function changeHslLightness(delta, hslStr) {
  const [hue, saturation, lightness] = hslStr.match(/\d+/g).map(Number);

  const newLightness = Math.max(
    0,
    Math.min(100, lightness + parseFloat(delta))
  );

  return `hsl(${hue}, ${saturation}%, ${newLightness}%)`;
};

//  changeHslLightness(10, 'hsl(330, 50%, 50%)'); // 'hsl(330, 50%, 60%)'