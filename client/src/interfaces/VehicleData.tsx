
interface VehicleData {
    id: number;
    vin: string;
    make: string;
    model: string;
    year: number;
    miles: number;
    color: string;
    price: number;
    UserId: number | null; // foreign key to User
    
    
}
  
export type { VehicleData };

