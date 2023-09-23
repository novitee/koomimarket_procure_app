interface BillingCartSummaryProps {
  deliveryFee: number;
  gst: number;
  subTotal: number;
  total: number;
}

const getBillingCartSummary = (billingCart: any) => {
  const init = {
    deliveryFee: 0,
    gst: 0,
    subTotal: 0,
    total: 0,
  };
  return (billingCart.cartGroups || []).reduce(
    (acc: BillingCartSummaryProps, group: any) => {
      if (!!group.supplier.COD) {
        acc.deliveryFee += group.deliveryFee;
        acc.gst += group.gst;
        acc.subTotal += group.subTotal;
      }
      return acc;
    },
    init,
  );
};

export const generateOfflineBillingCart = (
  billingCart: any,
  remark: string,
) => {
  const {total, subTotal, gst, deliveryFee} =
    getBillingCartSummary(billingCart);

  const newCartGroups = billingCart.cartGroups.reduce(
    (acc: any, group: any) => {
      if (!!group.supplier.COD) {
        acc.push({
          ...group,
          remark,
        });
      }
      return acc;
    },
    [],
  );

  return {
    ...billingCart,
    cartGroups: newCartGroups,
    total,
    subTotal,
    gst,
    deliveryFee,
    shippingAddress: null,
    billingAddress: null,
    offlinePaymentMethod: 'COD',
    remarks: remark,
  };
};
