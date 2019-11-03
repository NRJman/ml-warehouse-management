export interface RegistrationData {
    name: string;
    email: string;
    password: string;
    phone: number;
    isAdmin: boolean;
    warehouseId?: string;
}
