
interface HeartData {
    id?: number;
    date: Date;
    time: string | Date;
    systolic: number;
    diastolic: number;
    pulse: number;
    weight: number;
    UserId: number | null; // foreign key to User
    createdAt?: Date;
    updatedAt?: Date;
}
  
export type { HeartData };

