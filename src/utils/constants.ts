export const ORDER_STATUS: any = {
  sent: 'SUBMITTED',
  confirmed: 'ACKNOWLEDGED',
  packed: 'PACKED',
  completed: 'COMPLETED',
  cancelled: 'CANCELED',
  issue: 'RESOLVING',
  resolved: 'RESOLVED',
};

export const REASON_OPTIONS = [
  {
    id: 2,
    name: 'Wrong Quantity',
    value: 'WRONG_AMOUNT',
  },
  {
    id: 3,
    name: 'Poor Quality',
    value: 'POOR_QUALITY',
  },
  {
    id: 4,
    name: 'Other',
    value: 'OTHER',
  },
];
