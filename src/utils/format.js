export function formatFontWeight (value) {
  if (value === 700) return "Inter-Bold"
  else if (value === 600) return "Inter-SemiBold"
  else if (value === 500) return "Inter-Medium"
  else if (value === 400) return "Inter-Regular"
  else if (value === 300) return "Inter-Light"
  else if (value === 200) return "Inter-ExtraLight"
  else if (value === 100) return "Inter-Thin"
}