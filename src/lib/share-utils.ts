export interface SharedMessage {
  role: "user" | "assistant"
  content: string
}

/**
 * 将消息数组压缩并编码为短 base64 字符串（用于 URL）
 */
export async function encodeShareData(messages: SharedMessage[]): Promise<string> {
  const json = JSON.stringify(messages)
  const encoder = new TextEncoder()
  const compressed = await compressData(encoder.encode(json))
  return arrayBufferToBase64(compressed)
}

/**
 * 从 base64 字符串解码并解压得到消息数组
 */
export async function decodeShareData(encoded: string): Promise<SharedMessage[]> {
  const compressed = base64ToUint8Array(encoded)
  const decompressed = await decompressData(compressed)
  const text = new TextDecoder().decode(decompressed)
  return JSON.parse(text)
}

// ---- Compression ----

async function compressData(input: Uint8Array): Promise<Uint8Array> {
  const cs = new CompressionStream("gzip")
  const writer = cs.writable.getWriter()
  writer.write(input as BufferSource)
  writer.close()
  const blob = await new Response(cs.readable).blob()
  return new Uint8Array(await blob.arrayBuffer())
}

async function decompressData(input: Uint8Array): Promise<Uint8Array> {
  const ds = new DecompressionStream("gzip")
  const writer = ds.writable.getWriter()
  writer.write(input as BufferSource)
  writer.close()
  const blob = await new Response(ds.readable).blob()
  return new Uint8Array(await blob.arrayBuffer())
}

// ---- Base64 helpers (binary-safe) ----

function arrayBufferToBase64(buffer: Uint8Array): string {
  let binary = ""
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i])
  }
  return btoa(binary)
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

/**
 * 构建分享 URL
 */
export function buildShareUrl(data: string): string {
  const url = new URL(window.location.origin + "/share")
  url.searchParams.set("d", data)
  return url.href
}
