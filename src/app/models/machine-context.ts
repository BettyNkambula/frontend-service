
export class MachineContext {
    id: number;
    itemCount: number;
    balance: number; // current balance of money entered by user. may be returned
    income: number; // balance of money saved from dispensed item.
    dateTime: string;
    error: string;
}
