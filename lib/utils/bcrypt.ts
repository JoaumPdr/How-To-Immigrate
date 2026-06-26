import bcrypt from "bcryptjs";

/**
 * Gera um hash seguro a partir de uma senha de texto plano.
 * Utiliza o fator de custo 12 como padrão recomendado para segurança.
 * 
 * @param password Senha em texto plano
 * @returns Promessa com o hash da senha
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compara uma senha em texto plano com um hash gravado.
 * 
 * @param password Senha em texto plano a validar
 * @param hash Hash gravado no banco de dados
 * @returns Promessa que resolve para true se coincidir, false caso contrário
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
