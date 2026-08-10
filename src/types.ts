export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  engine: string;
  mileage: number;
  transmission: 'Automática' | 'Manual';
  image: string;
  category: 'SUV' | 'Sedán' | 'Deportivo' | 'Lujo';
  description: string;
  bodyType: string;
  color: string;
  fuelType: 'Gasolina' | 'Diésel' | 'Híbrido' | 'Eléctrico';
  featured?: boolean;
  images?: string[];
  // Especificaciones extendidas
  doors?: number;
  power?: string;
  traction?: string;
  capacity?: number;
  plateLastDigit?: string;
  plateType?: string;
  negotiable?: boolean;
  acceptsTrade?: boolean;
  version?: string;
  // Seguridad
  abs?: boolean;
  airbagDriver?: boolean;
  airbagPassenger?: boolean;
  stabilityControl?: boolean;
  parkingSensor?: boolean;
  reverseCamera?: boolean;
  automaticLights?: boolean;
  rearFogLights?: boolean;
  rearDefogger?: boolean;
  centralLocking?: boolean;
  thirdBrakeLightLed?: boolean;
  // Confort
  autopilot?: boolean;
  airConditioning?: boolean;
  electricWindows?: boolean;
  rainSensor?: boolean;
  steeringWheelControls?: boolean;
  cupHolder?: boolean;
  autoWindowClose?: boolean;
  boardComputer?: boolean;
  lightsOnAlert?: boolean;
  // General
  steering?: string;
  alarm?: boolean;
  // Exterior
  alloyWheels?: boolean;
  sunroof?: boolean;
  // Entretenimiento
  amFm?: boolean;
  auxInput?: boolean;
  bluetooth?: boolean;
  mp3?: boolean;
  usbInput?: boolean;
  // Interior
  leatherSeats?: boolean;
}

export interface Filters {
  brand: string;
  model: string;
  minPrice: number | '';
  maxPrice: number | '';
  year: string;
  category: string;
  bodyType: string;
  color: string;
  fuelType: string;
  search: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}
