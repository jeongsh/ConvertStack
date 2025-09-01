import { defineStore } from 'pinia'
import { colord, Colord } from 'colord'

interface ColorInfo {
  brightness: number
  saturation: number
  luminance: string
  alpha: number
  isWebSafe: boolean
  contrastWhite: string
  contrastBlack: string
}

export const useColorConverterStore = defineStore('colorConverter', () => {
  const hexValue = ref('#FF5733')
  const hexaValue = ref('')
  const rgbValue = ref('')
  const rgbaValue = ref('')
  const hslValue = ref('')
  const hslaValue = ref('')
  const currentColor = ref<Colord>(colord('#FF5733'))

  const previewColor = computed(() => {
    return currentColor.value.toHex()
  })

  const colorInfo = computed((): ColorInfo => {
    const color = currentColor.value
    
    // 간단한 대비율 계산 (WCAG 기준)
    const getLuminance = (r: number, g: number, b: number): number => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }
    
    const getContrastRatio = (rgb1: {r: number, g: number, b: number}, rgb2: {r: number, g: number, b: number}): number => {
      const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b)
      const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b)
      const brightest = Math.max(lum1, lum2)
      const darkest = Math.min(lum1, lum2)
      return (brightest + 0.05) / (darkest + 0.05)
    }
    
    const rgb = color.toRgb()
    const currentLuminance = getLuminance(rgb.r, rgb.g, rgb.b)
    
    return {
      brightness: Math.round(color.brightness() * 100),
      saturation: Math.round(color.toHsl().s),
      luminance: currentLuminance.toFixed(3),
      alpha: color.alpha(),
      isWebSafe: color.isValid() && /^#[0-9A-F]{6}$/i.test(color.toHex()),
      contrastWhite: getContrastRatio(rgb, { r: 255, g: 255, b: 255 }).toFixed(2),
      contrastBlack: getContrastRatio(rgb, { r: 0, g: 0, b: 0 }).toFixed(2)
    }
  })

  const updateFromHex = (value: string) => {
    if (!value) return
    
    try {
      const color = colord(value)
      if (color.isValid()) {
        currentColor.value = color
        // HEX에서 변경된 경우 다른 모든 포맷 업데이트
        hexaValue.value = color.toHex().toUpperCase()
        const rgb = color.toRgb()
        rgbValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`
        rgbaValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)}`
        const hsl = color.toHsl()
        hslValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
        hslaValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a.toFixed(2)}`
      }
    } catch (error) {
      console.error('Invalid HEX color:', error)
    }
  }

  const updateFromRgb = (value: string) => {
    if (!value) return
    
    try {
      const rgbMatch = value.match(/(\d+),?\s*(\d+),?\s*(\d+)/)
      if (rgbMatch) {
        const [, r, g, b] = rgbMatch
        const color = colord({ r: parseInt(r), g: parseInt(g), b: parseInt(b) })
        if (color.isValid()) {
          currentColor.value = color
          // RGB에서 변경된 경우 다른 모든 포맷 업데이트
          hexValue.value = color.toHex().toUpperCase()
          hexaValue.value = color.toHex().toUpperCase()
          const rgb = color.toRgb()
          rgbaValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)}`
          const hsl = color.toHsl()
          hslValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
          hslaValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a.toFixed(2)}`
        }
      }
    } catch (error) {
      console.error('Invalid RGB color:', error)
    }
  }

  const updateFromHsl = (value: string) => {
    if (!value) return
    
    try {
      const hslMatch = value.match(/(\d+)°?,?\s*(\d+)%?,?\s*(\d+)%?/)
      if (hslMatch) {
        const [, h, s, l] = hslMatch
        const color = colord({ h: parseInt(h), s: parseInt(s), l: parseInt(l) })
        if (color.isValid()) {
          currentColor.value = color
          // HSL에서 변경된 경우 다른 모든 포맷 업데이트
          hexValue.value = color.toHex().toUpperCase()
          hexaValue.value = color.toHex().toUpperCase()
          const rgb = color.toRgb()
          rgbValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`
          rgbaValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)}`
          const hsl = color.toHsl()
          hslaValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a.toFixed(2)}`
        }
      }
    } catch (error) {
      console.error('Invalid HSL color:', error)
    }
  }

  const updateFromHexa = (value: string) => {
    if (!value) return
    
    try {
      const color = colord(value)
      if (color.isValid()) {
        currentColor.value = color
        // HEXA에서 변경된 경우 다른 모든 포맷 업데이트
        hexValue.value = color.toHex().toUpperCase()
        const rgb = color.toRgb()
        rgbValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`
        rgbaValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)}`
        const hsl = color.toHsl()
        hslValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
        hslaValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a.toFixed(2)}`
      }
    } catch (error) {
      console.error('Invalid HEXA color:', error)
    }
  }

  const updateFromRgba = (value: string) => {
    if (!value) return
    
    try {
      const rgbaMatch = value.match(/(\d+),?\s*(\d+),?\s*(\d+),?\s*([0-9.]+)/)
      if (rgbaMatch) {
        const [, r, g, b, a] = rgbaMatch
        const color = colord({ r: parseInt(r), g: parseInt(g), b: parseInt(b), a: parseFloat(a) })
        if (color.isValid()) {
          currentColor.value = color
          // RGBA에서 변경된 경우 다른 모든 포맷 업데이트
          hexValue.value = color.toHex().toUpperCase()
          hexaValue.value = color.toHex().toUpperCase()
          const rgb = color.toRgb()
          rgbValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`
          const hsl = color.toHsl()
          hslValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
          hslaValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a.toFixed(2)}`
        }
      }
    } catch (error) {
      console.error('Invalid RGBA color:', error)
    }
  }

  const updateFromHsla = (value: string) => {
    if (!value) return
    
    try {
      const hslaMatch = value.match(/(\d+)°?,?\s*(\d+)%?,?\s*(\d+)%?,?\s*([0-9.]+)/)
      if (hslaMatch) {
        const [, h, s, l, a] = hslaMatch
        const color = colord({ h: parseInt(h), s: parseInt(s), l: parseInt(l), a: parseFloat(a) })
        if (color.isValid()) {
          currentColor.value = color
          // HSLA에서 변경된 경우 다른 모든 포맷 업데이트
          hexValue.value = color.toHex().toUpperCase()
          hexaValue.value = color.toHex().toUpperCase()
          const rgb = color.toRgb()
          rgbValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`
          rgbaValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)}`
          const hsl = color.toHsl()
          hslValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
        }
      }
    } catch (error) {
      console.error('Invalid HSLA color:', error)
    }
  }

  const initializeValues = () => {
    const color = currentColor.value
    hexValue.value = color.toHex().toUpperCase()
    hexaValue.value = color.toHex().toUpperCase()
    const rgb = color.toRgb()
    rgbValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`
    rgbaValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)}`
    const hsl = color.toHsl()
    hslValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
    hslaValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a.toFixed(2)}`
  }

  const setHexValue = (value: string) => {
    hexValue.value = value
    updateFromHex(value)
  }

  const setRgbValue = (value: string) => {
    rgbValue.value = value
    updateFromRgb(value)
  }

  const setHslValue = (value: string) => {
    hslValue.value = value
    updateFromHsl(value)
  }

  const setHexaValue = (value: string) => {
    hexaValue.value = value
    updateFromHexa(value)
  }

  const setRgbaValue = (value: string) => {
    rgbaValue.value = value
    updateFromRgba(value)
  }

  const setHslaValue = (value: string) => {
    hslaValue.value = value
    updateFromHsla(value)
  }

  const setColorFromPicker = (hexColor: string) => {
    try {
      const color = colord(hexColor)
      if (color.isValid()) {
        currentColor.value = color
        // 픽커에서 선택한 경우 모든 포맷을 업데이트
        hexValue.value = color.toHex().toUpperCase()
        hexaValue.value = color.toHex().toUpperCase()
        const rgb = color.toRgb()
        rgbValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}`
        rgbaValue.value = `${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a.toFixed(2)}`
        const hsl = color.toHsl()
        hslValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
        hslaValue.value = `${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${hsl.a.toFixed(2)}`
      }
    } catch (error) {
      console.error('Invalid color from picker:', error)
    }
  }

  const initialize = () => {
    initializeValues()
  }

  return {
    hexValue,
    hexaValue,
    rgbValue,
    rgbaValue,
    hslValue,
    hslaValue,
    previewColor,
    colorInfo,
    setHexValue,
    setHexaValue,
    setRgbValue,
    setRgbaValue,
    setHslValue,
    setHslaValue,
    setColorFromPicker,
    initialize
  }
})