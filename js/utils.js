const rgbToHsl = (r, g, b) => {
  r /= 255
  g /= 255
  b /= 255

  let min = Math.min(r, g, b) //Min. value of RGB
  let max = Math.max(r, g, b) //Max. value of RGB
  let delta = max - min //Delta RGB value

  let lum = (max + min) / 2

  let hue = 0
  let sat = 0
  if (delta == 0) {
    return [hue, sat, lum]
  } else {
    if (lum < 0.5) {
      sat = delta / (max + min)
    } else {
      sat = delta / (2 - max - min)
    }

    let deltaR = ((max - r) / 6 + delta / 2) / delta
    let deltaG = ((max - g) / 6 + delta / 2) / delta
    let deltaB = ((max - b) / 6 + delta / 2) / delta

    if (r == max) {
      hue = deltaB - deltaG
    } else if (g == max) {
      hue = 1 / 3 + deltaR - deltaB
    } else if (b == max) {
      hue = 2 / 3 + deltaG - deltaR
    }
    if (hue < 0) {
      hue += 1
    }
    if (hue > 1) {
      hue -= 1
    }
  }
  return [hue, sat, lum]
}

let hueToRgb = (q, z, t) => {
  if (t < 0) {
    t += 1
  }
  if (t > 1) {
    t -= 1
  }
  if (6 * t < 1) {
    return q + (z - q) * 6 * t
  }
  if (2 * t < 1) {
    return z
  }
  if (3 * t < 2) {
    return q + (z - q) * (2 / 3 - t) * 6
  }
  return q
}

let hslToRgb = (h, s, l) => {
  let r = 0
  let g = 0
  let b = 0
  let q = 0
  let z = 0
  if (s == 0) {
    r = l * 255
    g = l * 255
    b = l * 255
  } else {
    if (l < 0.5) {
      q = l * (1 + s)
    } else {
      q = l + s - s * l
    }
    z = 2 * l - q

    r = 255 * hueToRgb(z, q, h + 1 / 3)
    g = 255 * hueToRgb(z, q, h)
    b = 255 * hueToRgb(z, q, h - 1 / 3)
    return [r, g, b]
  }
  return [r, g, b]
}

export { rgbToHsl, hslToRgb }
