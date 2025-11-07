
interface HeartData {
    id: number;
    date: Date;
    time: Date;
    systolic: number;
    diastolic: number;
    pulse: number;
    weight: number;
    UserId: number | null; // foreign key to User
    
    
}
  
export type { HeartData };

