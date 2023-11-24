export  interface DashboardSummaryResponse {
    numberOfOrders:         number;
    paidOrders:             number; // isPad true
    numberOfClients:        number; //role: client
    numberOfProducts:       number;
    productsWithNoInventory:number; //0
    lowInventory:           number; //productos con 10 o menos
    notPaidOrders:          number;
}