
interface MaintenanceData {
    id?: number;
    mileage_due: number;
    maintenance_title: string;
    maintenance_description: string;
    parts_needed: string;
    cost: number;
    time_spent: number;
    completed?: boolean; // optional field to indicate if maintenance is completed
    VehicleId: number | null; // foreign key to Vehicle
    
    
}
  
export type { MaintenanceData };

