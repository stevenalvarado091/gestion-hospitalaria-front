import { Adjunto } from './adjunto';
import { Envio } from './envio';

export interface Correo {

  id: number;

  destinatario: string;

  asunto: string;

  mensaje: string;

  ingresoId: number;

  usuario: string;

  rolUsuario: string;

  fechaCreacion: string;

  adjuntos: Adjunto[];

  envios: Envio[];
}