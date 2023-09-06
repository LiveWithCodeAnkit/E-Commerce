export const formatPrice = (amount: number) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    });
  
    return formatter.format(amount);
  };