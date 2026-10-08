export function publicAssetUrl(url: string) {
  return url.startsWith('/') ? `${import.meta.env.BASE_URL}${url.slice(1)}` : url
}
