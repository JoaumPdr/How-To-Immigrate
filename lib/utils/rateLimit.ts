import { NextRequest } from "next/server";

// Estrutura em memória para rastrear as requisições dos clientes por IP
const tracker = new Map<string, { count: number; resetTime: number }>();

/**
 * Obtém o endereço IP do cliente a partir dos cabeçalhos da requisição
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "127.0.0.1";
}

/**
 * Verifica se um determinado IP estourou o limite de requisições na janela de tempo
 * 
 * @param ip Endereço IP do cliente
 * @param limit Limite máximo de requisições na janela (default: 60 requisições)
 * @param windowMs Tamanho da janela de tempo em milissegundos (default: 1 minuto - 60000ms)
 * @returns boolean true se estiver limitado, false caso contrário
 */
export function isRateLimited(ip: string, limit = 60, windowMs = 60000): boolean {
  const now = Date.now();
  const clientData = tracker.get(ip);

  // Limpeza periódica para evitar vazamento de memória se o mapa crescer muito
  if (tracker.size > 5000) {
    const cleanTime = Date.now();
    for (const [key, val] of tracker.entries()) {
      if (cleanTime > val.resetTime) {
        tracker.delete(key);
      }
    }
  }

  if (!clientData) {
    tracker.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (now > clientData.resetTime) {
    // A janela de tempo expirou, reinicia o contador
    tracker.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }

  clientData.count += 1;
  if (clientData.count > limit) {
    return true;
  }

  return false;
}
